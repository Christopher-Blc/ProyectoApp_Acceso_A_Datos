import {
  ConflictException,
  ForbiddenException,
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import nodemailer, { type Transporter } from 'nodemailer';
import Handlebars from 'handlebars';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createHash, randomBytes } from 'crypto';
import { AuthTokenBlacklist } from './blacklist/auth_token_blacklist.entity';
import { AuthUserPayload } from './types/auth.types';

/**
 * Authentication service.
 *
 * Main responsibilities:
 * - Login and JWT token refresh.
 * - Credential validation.
 * - Access token blacklist for strong logout.
 * - Sanitization of sensitive data before responding.
 */
@Injectable()
export class AuthService {
  private mailTransporter: Transporter | null = null;

  private async renderVerificationEmailTemplate(
    userName: string,
    verifyUrl: string,
  ): Promise<string> {
    const templatePath = join(__dirname, 'templates', 'verification-email.hbs');
    const templateSource = await readFile(templatePath, 'utf8');
    const compileTemplate = Handlebars.compile<{
      userName: string;
      verifyUrl: string;
      year: number;
    }>(templateSource, { strict: true });

    return compileTemplate({
      userName,
      verifyUrl,
      year: new Date().getFullYear(),
    });
  }

  private buildEmailVerificationToken(): {
    plainToken: string;
    tokenHash: string;
    expiresAt: Date;
  } {
    const ttlMinutes = Number(process.env.EMAIL_VERIFICATION_TTL_MINUTES || 30);
    const plainToken = randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(plainToken);
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);
    return { plainToken, tokenHash, expiresAt };
  }

  private buildPasswordResetToken(): {
    plainToken: string;
    tokenHash: string;
    expiresAt: Date;
  } {
    const ttlMinutes = Number(process.env.PASSWORD_RESET_TTL_MINUTES || 30);
    const plainToken = randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(plainToken);
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);
    return { plainToken, tokenHash, expiresAt };
  }

  private buildVerificationUrl(plainToken: string): string {
    return `https://respi.es/(auth)/verify-email?token=${encodeURIComponent(plainToken)}`;
  }

  private buildResetPasswordUrl(plainToken: string): string {
    return `https://respi.es/(auth)/reset-password?token=${encodeURIComponent(plainToken)}`;
  }

  private getMailTransporter(): Transporter | null {
    if (this.mailTransporter) {
      return this.mailTransporter;
    }

    const host = process.env.SMTP_HOST;
    const portRaw = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !portRaw || !user || !pass) {
      return null;
    }

    const port = Number(portRaw);
    const secure =
      process.env.SMTP_SECURE === 'true' ||
      (!Number.isNaN(port) && port === 465);

    this.mailTransporter = nodemailer.createTransport({
      host,
      port: Number.isNaN(port) ? 587 : port,
      secure,
      auth: {
        user,
        pass,
      },
    });

    return this.mailTransporter;
  }

  private async sendVerificationEmail(
    targetEmail: string,
    userName: string,
    verifyUrl: string,
  ): Promise<void> {
    const transporter = this.getMailTransporter();

    if (!transporter) {
      throw new InternalServerErrorException('Email service not configured');
    }

    const fromAddress = process.env.SMTP_FROM || 'ResPi <no-reply@respi.es>';
    const htmlBody = await this.renderVerificationEmailTemplate(
      userName,
      verifyUrl,
    );

    await transporter.sendMail({
      from: fromAddress,
      to: targetEmail,
      subject: 'Confirma tu correo en RESPI',
      text: `Hola ${userName},\n\nConfirma tu correo pulsando este enlace:\n${verifyUrl}\n\nSi no has sido tu, ignora este mensaje.`,
      html: htmlBody,
    });
  }

  private async sendPasswordResetEmail(
    targetEmail: string,
    userName: string,
    resetUrl: string,
  ): Promise<void> {
    const transporter = this.getMailTransporter();

    if (!transporter) {
      throw new InternalServerErrorException('Email service not configured');
    }

    const fromAddress = process.env.SMTP_FROM || 'ResPi <no-reply@respi.es>';

    await transporter.sendMail({
      from: fromAddress,
      to: targetEmail,
      subject: 'Recupera tu contrasena en RESPI',
      text: `Hola ${userName},\n\nPulsa este enlace para restablecer tu contrasena:\n${resetUrl}\n\nSi no has sido tu, ignora este mensaje.`,
      html: `<p>Hola ${userName},</p><p>Pulsa este enlace para restablecer tu contrasena:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>Si no has sido tu, ignora este mensaje.</p>`,
    });
  }

  /**
   * Renews the access token using a valid refresh token.
   */
  async refresh(
    refresh_token: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    // El payload se escribe explícitamente para evitar propagar `any`.
    let payload: AuthUserPayload;

    try {
      payload = await this.jwtService.verifyAsync(refresh_token, {
        secret: process.env.JWT_REFRESH_SECRET as string,
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // `sub` representa el id lógico del usuario autenticado.
    const user = await this.usersService.findById(Number(payload.sub));
    if (!user) throw new UnauthorizedException('User does not exist');
    if (!user.is_active) throw new ForbiddenException('Inactive user');
    if (!user.refresh_token_hash)
      throw new UnauthorizedException('No refresh token saved');

    const ok = await bcrypt.compare(refresh_token, user.refresh_token_hash);
    if (!ok) throw new UnauthorizedException('Invalid refresh token');

    // Reconstruimos el payload de la entidad actual para evitar datos obsoletos.
    // Escribimos como Record para mayor claridad, aunque JwtService.signAsync tiene limitaciones
    // en sus sobrecargas que requieren `as any` en la llamada.
    const newPayload: Record<string, string | number> = {
      sub: String(user.id),
      email: user.email,
      role: String(user.role),
    };

    // NOTA: JwtService.signAsync tiene sobrecargas que no capturan correctamente
    // objetos Record<string, string | number>. Aunque los tipos son correctos
    // en tiempo de ejecución, TypeScript los rechaza. `as any` se usa aquí de manera localizada.
    // @ts-expect-error - JwtService.signAsync overload mismatch with Record<string, string | number>
    const access_token = await this.jwtService.signAsync(newPayload, {
      secret: process.env.JWT_ACCESS_SECRET as string,
      expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    });

    // @ts-expect-error - JwtService.signAsync overload mismatch with Record<string, string | number>
    const new_refresh_token = await this.jwtService.signAsync(newPayload, {
      secret: process.env.JWT_REFRESH_SECRET as string,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    });

    // Rotación de token de refresco: guardamos el hash del nuevo token.
    const newHash = await bcrypt.hash(new_refresh_token, 10);
    await this.usersService.updateRefreshTokenHash(user.id, newHash);

    return { access_token, refresh_token: new_refresh_token };
  }

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    // Repositorio para persistir tokens revocados
    @InjectRepository(AuthTokenBlacklist)
    private readonly tokenBlacklistRepository: Repository<AuthTokenBlacklist>,
  ) {}

  /**
   * Convierte el token en hash para no persistir secretos en texto plano.
   */
  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  /**
   * Comprueba si el access token está en blacklist y no ha expirado.
   */
  async isAccessTokenBlacklisted(token: string): Promise<boolean> {
    const tokenHash = this.hashToken(token);
    const now = new Date();
    const record = await this.tokenBlacklistRepository.findOne({
      where: { tokenHash },
    });

    return !!record && record.expiresAt > now;
  }

  /**
   * Registro de usuario cliente con validaciones de unicidad.
   */
  async register(dto: RegisterDto) {
    const duplicateEmail = await this.usersService.findByEmail(dto.email);
    if (duplicateEmail) throw new ConflictException('Email already registered');

    const duplicatePhone = await this.usersService.findByPhone(dto.phone);
    if (duplicatePhone) throw new ConflictException('Phone already registered');

    const duplicateUsername = await this.usersService.findByUserName(
      dto.username,
    );
    if (duplicateUsername)
      throw new ConflictException('Username already registered');

    const created = await this.usersService.create({
      ...dto,
      password: dto.password,
      role: UserRole.CLIENT,
      is_active: true,
      email_verified: false,
      registration_date: new Date(),
      date_of_birth: new Date(dto.date_of_birth),
    });

    const { plainToken, tokenHash, expiresAt } =
      this.buildEmailVerificationToken();
    await this.usersService.setEmailVerificationData(
      created.id,
      tokenHash,
      expiresAt,
    );

    const verifyUrl = this.buildVerificationUrl(plainToken);
    await this.sendVerificationEmail(
      created.email,
      created.name || created.username,
      verifyUrl,
    );

    return {
      message:
        'Registro completado. Revisa tu correo para confirmar la cuenta antes de iniciar sesion.',
    };
  }

  async resendVerificationEmail(email: string): Promise<Record<string, string>> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return {
        message:
          'Si el correo existe, se ha enviado un nuevo enlace de verificacion.',
      };
    }

    if (user.email_verified) {
      return {
        message: 'El correo ya esta verificado.',
      };
    }

    const { plainToken, tokenHash, expiresAt } =
      this.buildEmailVerificationToken();
    await this.usersService.setEmailVerificationData(user.id, tokenHash, expiresAt);

    const verifyUrl = this.buildVerificationUrl(plainToken);
    await this.sendVerificationEmail(
      user.email,
      user.name || user.username,
      verifyUrl,
    );

    return {
      message: 'Se ha enviado un nuevo correo de verificacion.',
    };
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const tokenHash = this.hashToken(token);
    const user = await this.usersService.findByEmailVerificationTokenHash(tokenHash);

    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }

    if (user.email_verified) {
      return { message: 'Email already verified' };
    }

    if (!user.email_verification_expires_at) {
      throw new BadRequestException('Verification token has expired');
    }

    if (user.email_verification_expires_at.getTime() < Date.now()) {
      throw new BadRequestException('Verification token has expired');
    }

    await this.usersService.markEmailAsVerified(user.id);
    return { message: 'Email verified successfully' };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(email);

    // Respuesta neutra para no exponer si el correo existe o no.
    const genericResponse = {
      message:
        'Si el correo existe, se ha enviado un enlace para restablecer la contrasena.',
    };

    if (!user) {
      return genericResponse;
    }

    const { plainToken, tokenHash, expiresAt } = this.buildPasswordResetToken();
    await this.usersService.setPasswordResetData(user.id, tokenHash, expiresAt);

    const resetUrl = this.buildResetPasswordUrl(plainToken);
    await this.sendPasswordResetEmail(
      user.email,
      user.name || user.username,
      resetUrl,
    );

    return genericResponse;
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const tokenHash = this.hashToken(token);
    const user = await this.usersService.findByPasswordResetTokenHash(tokenHash);

    if (!user) {
      throw new BadRequestException('Invalid reset token');
    }

    if (!user.password_reset_expires_at) {
      throw new BadRequestException('Reset token has expired');
    }

    if (user.password_reset_expires_at.getTime() < Date.now()) {
      throw new BadRequestException('Reset token has expired');
    }

    await this.usersService.updatePassword(user.id, newPassword);
    await this.usersService.clearPasswordResetData(user.id);
    await this.usersService.updateRefreshTokenHash(user.id, null);

    return { message: 'Password reset successfully' };
  }

  /**
   * Login con emisión de access token + refresh token.
   */
  async login(dto: LoginDto): Promise<{
    access_token: string;
    refresh_token: string;
    user: Record<string, unknown>;
  }> {
    // Busca usuario por email y valida estado de cuenta.
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Incorrect credentials');
    if (!user.is_active) throw new ForbiddenException('Inactive user');
    if (!user.email_verified) {
      throw new ForbiddenException(
        'Email not verified. Please confirm your email before login',
      );
    }

    // Comparación segura de hash de contraseña.
    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) throw new UnauthorizedException('Incorrect credentials');
    // Actualiza último login
    await this.usersService.updateLastLogin(user.id);

    // Payload mínimo de identidad/autorización para JWT.
    // Escribimos como Record para mayor claridad, aunque JwtService.signAsync tiene limitaciones
    // en sus sobrecargas que requieren `as any` en la llamada.
    const payload: Record<string, string | number> = {
      sub: String(user.id),
      email: user.email,
      role: String(user.role),
    };

    // NOTA: JwtService.signAsync tiene sobrecargas que no capturan correctamente
    // objetos Record<string, string | number>. Aunque los tipos son correctos
    // en tiempo de ejecución, TypeScript los rechaza. `as any` se usa aquí de manera localizada.
    // @ts-expect-error - JwtService.signAsync overload mismatch with Record<string, string | number>
    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET as string,
      expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    });

    // @ts-expect-error - JwtService.signAsync overload mismatch with Record<string, string | number>
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET as string,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    });

    // Persistimos hash del refresh para validarlo en futuras renovaciones.
    const refreshHash = await bcrypt.hash(refresh_token, 10);
    await this.usersService.updateRefreshTokenHash(user.id, refreshHash);

    // Sanitización final: nunca exponer password ni hash de refresh.
    const userSafe: Record<string, unknown> = { ...user };
    delete userSafe.password;
    delete userSafe.refresh_token_hash;

    return { access_token, refresh_token, user: userSafe };
  }

  /**
   * Logout fuerte:
   * - revoca access token guardando su hash en blacklist
   * - invalida refresh token almacenado
   */
  async logout(
    userId: number,
    accessToken: string,
    expiresAt: Date,
  ): Promise<{ message: string }> {
    if (!userId) throw new UnauthorizedException('No autorizado');
    if (!accessToken) throw new UnauthorizedException('No autorizado');

    const tokenHash = this.hashToken(accessToken);
    await this.tokenBlacklistRepository.save({
      userId,
      tokenHash,
      expiresAt,
    });

    // Invalidas cualquier refresh existente
    await this.usersService.updateRefreshTokenHash(userId, null);

    return { message: 'Logout ok' };
  }
}

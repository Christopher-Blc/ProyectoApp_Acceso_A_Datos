import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createHash } from 'crypto';
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
    if (!user.isActive) throw new ForbiddenException('Inactive user');
    if (!user.refresh_token_hash)
      throw new UnauthorizedException('No refresh token saved');

    const ok = await bcrypt.compare(refresh_token, user.refresh_token_hash);
    if (!ok) throw new UnauthorizedException('Invalid refresh token');

    // Reconstruimos el payload de la entidad actual para evitar datos obsoletos.
    // Escribimos como Record para mayor claridad, aunque JwtService.signAsync tiene limitaciones
    // en sus sobrecargas que requieren `as any` en la llamada.
    const newPayload: Record<string, string | number> = {
      sub: String(user.usuario_id),
      email: user.email,
      role: String(user.role),
    };

    // NOTA: JwtService.signAsync tiene sobrecargas que no capturan correctamente
    // objetos Record<string, string | number>. Aunque los tipos son correctos
    // en tiempo de ejecución, TypeScript los rechaza. `as any` se usa aquí de manera localizada.
    const access_token = await this.jwtService.signAsync(
      newPayload as any,
      {
        secret: process.env.JWT_ACCESS_SECRET as string,
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
      } as any,
    );

    const new_refresh_token = await this.jwtService.signAsync(
      newPayload as any,
      {
        secret: process.env.JWT_REFRESH_SECRET as string,
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
      } as any,
    );

    // Rotación de token de refresco: guardamos el hash del nuevo token.
    const newHash = await bcrypt.hash(new_refresh_token, 10);
    await this.usersService.updateRefreshTokenHash(user.usuario_id, newHash);

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
      where: { token_hash: tokenHash },
    });

    return !!record && record.expires_at > now;
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
      role: UserRole.CLIENTE,
      isActive: true,
      fecha_registro: new Date(),
      fecha_nacimiento: new Date(dto.fecha_nacimiento),
    });

    // Eliminamos datos sensibles de la respuesta pública.
    const userSafe: Record<string, unknown> = { ...created };
    delete userSafe.password;
    return this.login({ email: dto.email, password: dto.password }).then(
      (tokens) => {
        return { ...tokens, user: userSafe };
      },
    );
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
    if (!user.isActive) throw new ForbiddenException('Inactive user');

    // Comparación segura de hash de contraseña.
    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) throw new UnauthorizedException('Incorrect credentials');
    // Actualiza último login
    await this.usersService.updateLastLogin(user.usuario_id);

    // Payload mínimo de identidad/autorización para JWT.
    // Escribimos como Record para mayor claridad, aunque JwtService.signAsync tiene limitaciones
    // en sus sobrecargas que requieren `as any` en la llamada.
    const payload: Record<string, string | number> = {
      sub: String(user.usuario_id),
      email: user.email,
      role: String(user.role),
    };

    // NOTA: JwtService.signAsync tiene sobrecargas que no capturan correctamente
    // objetos Record<string, string | number>. Aunque los tipos son correctos
    // en tiempo de ejecución, TypeScript los rechaza. `as any` se usa aquí de manera localizada.
    const access_token = await this.jwtService.signAsync(
      payload as any,
      {
        secret: process.env.JWT_ACCESS_SECRET as string,
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
      } as any,
    );

    const refresh_token = await this.jwtService.signAsync(
      payload as any,
      {
        secret: process.env.JWT_REFRESH_SECRET as string,
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
      } as any,
    );

    // Persistimos hash del refresh para validarlo en futuras renovaciones.
    const refreshHash = await bcrypt.hash(refresh_token, 10);
    await this.usersService.updateRefreshTokenHash(
      user.usuario_id,
      refreshHash,
    );

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
      usuario_id: userId,
      token_hash: tokenHash,
      expires_at: expiresAt,
    });

    // Invalidas cualquier refresh existente
    await this.usersService.updateRefreshTokenHash(userId, null);

    return { message: 'Logout ok' };
  }
}

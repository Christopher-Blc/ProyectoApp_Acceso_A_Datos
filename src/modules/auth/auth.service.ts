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
 * Servicio de autenticación.
 *
 * Responsabilidades principales:
 * - Login y Refresh de tokens JWT.
 * - Validación de credenciales.
 * - Blacklist de access tokens para logout fuerte.
 * - Sanitización de datos sensibles antes de responder.
 */
@Injectable()
export class AuthService {
  /**
   * Renueva el access token usando un refresh token válido.
   */
  async refresh(
    refresh_token: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    // Se tipa el payload explícitamente para no propagar `any`.
    let payload: AuthUserPayload;

    try {
      payload = await this.jwtService.verifyAsync(refresh_token, {
        secret: process.env.JWT_REFRESH_SECRET as string,
      });
    } catch {
      throw new UnauthorizedException('Refresh token inválido o caducado');
    }

    // `sub` representa el id lógico del usuario autenticado.
    const user = await this.usersService.findById(Number(payload.sub));
    if (!user) throw new UnauthorizedException('Usuario no existe');
    if (!user.isActive) throw new ForbiddenException('Usuario inactivo');
    if (!user.refresh_token_hash)
      throw new UnauthorizedException('No hay refresh guardado');

    const ok = await bcrypt.compare(refresh_token, user.refresh_token_hash);
    if (!ok) throw new UnauthorizedException('Refresh token inválido');

    // Reconstruimos payload a partir de la entidad actual para evitar stale data.
    // Tipamos como Record para claridad, aunque JwtService.signAsync tenga limitaciones
    // en sus overloads que requieren `as any` en la llamada.
    const newPayload: Record<string, string | number> = {
      sub: String(user.usuario_id),
      email: user.email,
      role: String(user.role),
    };

    // NOTA: JwtService.signAsync tiene overloads que no capturan correctamente
    // objetos Record<string, string | number>. Aunque los tipos son correctos
    // en tiempo de ejecución, TypeScript los rechaza. Se usa `as any` aquí
    // de forma localizada.
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

    // Rotación de refresh: guardamos hash del nuevo refresh token.
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
   * Convierte token crudo en hash para no persistir secretos en texto plano.
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
    if (duplicateEmail) throw new ConflictException('Email ya registrado');

    const duplicatePhone = await this.usersService.findByPhone(dto.phone);
    if (duplicatePhone) throw new ConflictException('Teléfono ya registrado');

    const duplicateUsername = await this.usersService.findByUserName(
      dto.username,
    );
    if (duplicateUsername)
      throw new ConflictException('Username ya registrado');

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
    if (!user) throw new UnauthorizedException('Credenciales incorrectas');
    if (!user.isActive) throw new ForbiddenException('Usuario inactivo');

    // Contraste seguro de password hash.
    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) throw new UnauthorizedException('Credenciales incorrectas');
    //actualizar ultimo login
    await this.usersService.updateLastLogin(user.usuario_id);

    // Payload mínimo de identidad/autorización para el JWT.
    // Tipamos como Record para claridad, aunque JwtService.signAsync tenga limitaciones
    // en sus overloads que requieren `as any` en la llamada.
    const payload: Record<string, string | number> = {
      sub: String(user.usuario_id),
      email: user.email,
      role: String(user.role),
    };

    // NOTA: JwtService.signAsync tiene overloads que no capturan correctamente
    // objetos Record<string, string | number>. Aunque los tipos son correctos
    // en tiempo de ejecución, TypeScript los rechaza. Se usa `as any` aquí
    // de forma localizada.
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

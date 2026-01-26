import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import type { StringValue } from "ms";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createHash } from 'crypto';
import { AuthTokenBlacklist } from './auth-token-blacklist.entity';

@Injectable()
export class AuthService {
  async refresh(refresh_token: string): Promise<{ access_token: string; refresh_token: string }> {
    let payload: any;

    try {
      payload = await this.jwtService.verifyAsync(refresh_token, {
        secret: process.env.JWT_REFRESH_SECRET as string,
      });
    } catch {
      throw new UnauthorizedException("Refresh token inválido o caducado");
    }

    const user = await this.usersService.findById(Number(payload.sub));
    if (!user) throw new UnauthorizedException("Usuario no existe");
    if (!user.isActive) throw new ForbiddenException("Usuario inactivo");
    if (!user.refresh_token_hash) throw new UnauthorizedException("No hay refresh guardado");

    const ok = await bcrypt.compare(refresh_token, user.refresh_token_hash);
    if (!ok) throw new UnauthorizedException("Refresh token inválido");

    const newPayload = { sub: user.usuario_id, email: user.email, role: user.role };

  const access_token = await this.jwtService.signAsync(newPayload, {
    secret: process.env.JWT_ACCESS_SECRET as string,
    expiresIn: (process.env.JWT_EXPIRES_IN || "15m") as StringValue,
  });

    const new_refresh_token = await this.jwtService.signAsync(newPayload, {
      secret: process.env.JWT_REFRESH_SECRET as string,
      expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || "7d") as StringValue,
    });

    const newHash = await bcrypt.hash(new_refresh_token, 10);
    await this.usersService.updateRefreshTokenHash(user.usuario_id, newHash);

    return { access_token, refresh_token: new_refresh_token };
  }


   constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    // Repositorio para persistir tokens revocados
    @InjectRepository(AuthTokenBlacklist)
    private readonly tokenBlacklistRepository: Repository<AuthTokenBlacklist>
  ) {}

  // Devuelve un hash SHA-256 del token para guardarlo de forma segura
  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  // Comprueba si un access token está revocado y sigue dentro de su expiración
  async isAccessTokenBlacklisted(token: string): Promise<boolean> {
    const tokenHash = this.hashToken(token);
    const now = new Date();
    const record = await this.tokenBlacklistRepository.findOne({
      where: { token_hash: tokenHash },
    });

    return !!record && record.expires_at > now;
  }

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email ya registrado');

    const created = await this.usersService.create({
      ...dto,
      password: dto.password,
      role: UserRole.CLIENTE,
      isActive: true,
      fecha_registro: new Date(),
      fecha_nacimiento: new Date(dto.fecha_nacimiento),
    });

    const { password, ...userSafe } = created;
    return userSafe;
  }

  async login(dto: LoginDto): Promise<{ access_token: string; refresh_token: string; user: any }> {

    //se busca el user por email y se comprueba que sea un usuario activo y que contraseña correcta
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Credenciales incorrectas');
    if (!user.isActive) throw new ForbiddenException('Usuario inactivo');

    //manejo y encriptacion del password
    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) throw new UnauthorizedException('Credenciales incorrectas');
    //actualizar ultimo login
    await this.usersService.updateLastLogin(user.usuario_id);

    //playload es el objeto que se va a usar para crear el token
    const payload = {
      sub: user.usuario_id,
      email: user.email,
      role: user.role,
    };

    //generamos el token
    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET as string,
      expiresIn: (process.env.JWT_EXPIRES_IN || "15m") as StringValue,
    });
    
    //generamos el refresh token
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET as string,
      expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || "7d") as StringValue,
    });

    const refreshHash = await bcrypt.hash(refresh_token, 10);
    await this.usersService.updateRefreshTokenHash(user.usuario_id, refreshHash);

    //devolvemos el usuario sin la contraseña y sin el hash del refresh token
    const { password, refresh_token_hash, ...userSafe } = user;


    return { access_token, refresh_token, user: userSafe };

  }

  // Logout fuerte: revoca el access token y elimina el refresh token almacenado
  async logout(userId: number, accessToken: string, expiresAt: Date): Promise<{ message: string }> {
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

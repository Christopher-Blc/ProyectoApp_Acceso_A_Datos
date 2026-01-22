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
    private readonly jwtService: JwtService
  ) {}

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
}

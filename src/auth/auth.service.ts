import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '../users/user.entity';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email ya registrado');

    const hash = await bcrypt.hash(dto.password, 10);

    const created = await this.usersService.create({
      ...dto,
      password: hash,
      role: UserRole.CLIENTE,
      isActive: true,
      fecha_registro: new Date(),
    });

    const { password, ...userSafe } = created;
    return userSafe;
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Credenciales incorrectas');

    if (!user.isActive) throw new ForbiddenException('Usuario inactivo');

    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) throw new UnauthorizedException('Credenciales incorrectas');

    await this.usersService.updateLastLogin(user.usuario_id);

    const { password, ...userSafe } = user;
    return {
      user: userSafe,
      token: 'TEMP',
    };
  }
}

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

@Injectable()
export class AuthService {

   constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

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
      fecha_nacimiento: new Date(dto.fecha_nacimiento),
    });

    const { password, ...userSafe } = created;
    return userSafe;
  }

  async login(dto: LoginDto): Promise<{ access_token: string; user: any }> {

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
    const access_token = await this.jwtService.signAsync(payload);
    //devolvemos el usuario sin la contraseña
    const { password, ...userSafe } = user;
    //returnamos el token y el usuario sin la contraseña
    return { access_token, user: userSafe };
  }

}

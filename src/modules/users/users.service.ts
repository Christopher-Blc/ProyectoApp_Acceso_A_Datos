import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User, UserRole } from './entities/user.entity';
import { UpdateUserDto } from './dto/users.dto';
import { Membership } from '../membership/entities/membership.entity'; // Asegúrate de que la ruta sea correcta
import { Reservation, estadoReserva } from '../reservation/entities/reservation.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    // Necesitamos Membership porque aquí aplicamos la lógica que, según las reservas hechas,
    // asignará una membresía u otra automáticamente
    @InjectRepository(Membership)
    private readonly membresiaRepository: Repository<Membership>,
    @InjectRepository(Reservation)
    private readonly reservaRepository: Repository<Reservation>,
  ) {}

  // Actualización automática de membresía
  async updateUserRank(usuario_id: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { usuario_id },
      relations: ['Membership'],
    });

    if (!user) return;

    // Contamos solo reservas finalizadas en BD para el usuario.
    const totalFinalizadas = await this.reservaRepository.count({
      where: {
        usuario_id,
        estado: estadoReserva.FINALIZADA,
      },
    });

    // Buscamos en la tabla de membresías cuál le corresponde al usuario.
    // Elegimos la membresía con mayor 'reservas_requeridas'
    // que sea menor o igual a las reservas del usuario.
    const mejorMembership = await this.membresiaRepository.findOne({
      where: {
        reservas_requeridas: LessThanOrEqual(totalFinalizadas),
      },
      order: {
        reservas_requeridas: 'DESC', // La que exige más reservas (la mejor), primero
      },
    });

    if (mejorMembership && user.Membership_id !== mejorMembership.Membership_id) {
      await this.userRepository.update(usuario_id, {
        Membership_id: mejorMembership.Membership_id,
      });
    }
  }

  // Actualización con protección de campos (solo Admin cambia Role y Membership)
  async update(
    usuario_id: number,
    data: UpdateUserDto,
    isSelfUpdate: boolean = false,
  ): Promise<User> {
    const user = await this.findOne(usuario_id);

    if (isSelfUpdate) {
      // Bloqueamos que el usuario cambie estos campos por su cuenta
      delete data.role;
      delete data.Membership_id;
      delete data.isActive;
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    this.userRepository.merge(user, data);
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      relations: ['reservas', 'Membership'],
    });
  }

  async findOne(usuario_id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { usuario_id },
      relations: ['reservas', 'Membership'],
    });
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  async create(data: Partial<User>): Promise<User> {
    try {
      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
      }
      const user = this.userRepository.create(data);
      return await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        // Controlamos duplicados aquí, aunque register ya lo valida
        throw new BadRequestException('Email/Username/Phone already exists');
      }
      throw new InternalServerErrorException();
    }
  }

  async remove(usuario_id: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { usuario_id },
      relations: ['reservas'],
    });

    if (!user) throw new NotFoundException('User not found');

    const hoy = new Date();
    const tienePendientes = user.reservas.some(
      (r) => new Date(r.fecha_Reservation) >= hoy,
    );

    if (tienePendientes) {
      throw new BadRequestException('Tienes reservas pendientes');
    }

    await this.userRepository.remove(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();
  }

  async findByUserName(username: string): Promise<User | null> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .addSelect('user.password')
      .getOne();
  }

  async findByPhone(phone: string): Promise<User | null> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.phone = :phone', { phone })
      .getOne();
  }

  async updateLastLogin(usuario_id: number): Promise<void> {
    await this.userRepository.update(
      { usuario_id },
      { fecha_ultimo_login: new Date() },
    );
  }

  async findById(usuario_id: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { usuario_id } });
  }

  async updateRefreshTokenHash(
    usuario_id: number,
    hash: string | null,
  ): Promise<void> {
    await this.userRepository.update(
      { usuario_id },
      { refresh_token_hash: hash },
    );
  }
}






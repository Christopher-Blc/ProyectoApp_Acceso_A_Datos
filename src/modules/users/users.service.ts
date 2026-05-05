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
import { Membership } from '../membership/entities/membership.entity';
import { Reservation, estadoReserva } from '../reservation/entities/reservation.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Membership)
    private readonly membresiaRepository: Repository<Membership>,
    @InjectRepository(Reservation)
    private readonly reservaRepository: Repository<Reservation>,
  ) {}

  async updateUserRank(usuario_id: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { usuario_id },
      relations: ['Membership'],
    });

    if (!user) return;

    const totalFinalizadas = await this.reservaRepository.count({
      where: {
        usuario_id,
        estado: estadoReserva.FINALIZADA,
      },
    });

    const mejorMembership = await this.membresiaRepository.findOne({
      where: {
        reservas_requeridas: LessThanOrEqual(totalFinalizadas),
      },
      order: {
        reservas_requeridas: 'DESC',
      },
    });

    if (mejorMembership && user.Membership_id !== mejorMembership.Membership_id) {
      await this.userRepository.update(usuario_id, {
        Membership_id: mejorMembership.Membership_id,
      });
    }
  }

  async update(
    usuario_id: number,
    data: UpdateUserDto,
    isSelfUpdate: boolean,
  ): Promise<User> {
    await this.findOne(usuario_id);

    if (isSelfUpdate) {
      delete data.role;
      delete data.Membership_id;
      delete data.isActive;
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    await this.userRepository.update(usuario_id, data);
    return this.findOne(usuario_id);
  }

  async updatePushToken(
    usuario_id: number,
    expoPushToken: string,
  ): Promise<User> {
    await this.findOne(usuario_id);
    await this.userRepository.update(usuario_id, { expoPushToken });
    return this.findOne(usuario_id);
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
      const dbError = error as { code?: string };
      if (dbError.code === '23505') {
        // Controlamos duplicados aquí aunque en register ya se verifica
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

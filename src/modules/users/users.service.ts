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
import { Reservation, estadoReservation } from '../reservationtiontion/entities/reservation.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    // We need Membership because here we'll have the logic that according to reservations made,
    // we'll assign one membership or another automatically
    @InjectRepository(Membresia)
    private readonly membresiaRepository: Repository<Membresia>,
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,
  ) {}

  // Automatic membership update
  async updateUserRank(usuario_id: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { usuario_id },
      relations: ['membresia'],
    });

    if (!user) return;

    // We count only completed reservations in DB for the user.
    const totalFinalizadas = await this.reservaRepository.count({
      where: {
        usuario_id,
        estado: estadoReserva.FINALIZADA,
      },
    });

    // We search in the memberships table which one corresponds to the user.
    // We search for the membership with the highest number of 'reservas_requeridas'
    // that is less than or equal to the user's reservations.
    const mejorMembership = await this.membresiaRepository.findOne({
      where: {
        reservas_requeridas: LessThanOrEqual(totalFinalizadas),
      },
      order: {
        reservas_requeridas: 'DESC', // The one that requires more reservations (the best) first
      },
    });

    if (mejorMembership && user.membresia_id !== mejorMembresia.membresia_id) {
      await this.userRepository.update(usuario_id, {
        membresia_id: mejorMembresia.membresia_id,
      });
    }
  }

  // Update with field protection (Only Admin changes Role and Membresia)
  async update(
    usuario_id: number,
    data: UpdateUserDto,
    isSelfUpdate: boolean = false,
  ): Promise<User> {
    const user = await this.findOne(usuario_id);

    if (isSelfUpdate) {
      // We block the user from changing these things themselves
      delete data.role;
      delete data.membresia_id;
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
      relations: ['reservas', 'membresia'],
    });
  }

  async findOne(usuario_id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { usuario_id },
      relations: ['reservas', 'membresia'],
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
        // We control duplicates here although register already verifies it
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
      (r) => new Date(r.fecha_reserva) >= hoy,
    );

    if (tienePendientes) {
      throw new BadRequestException('You have pending reservations');
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




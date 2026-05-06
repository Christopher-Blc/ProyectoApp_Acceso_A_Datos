import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/users.dto';
import { Membership } from '../membership/entities/membership.entity';
import {
  Reservation,
  ReservationStatus,
} from '../reservation/entities/reservation.entity';

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

  async updateUserRank(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['membership'],
    });

    if (!user) return;

    const totalFinalizadas = await this.reservaRepository.count({
      where: {
        userId,
        status: ReservationStatus.COMPLETED,
      },
    });

    const mejorMembership = await this.membresiaRepository.findOne({
      where: {
        requiredReservations: LessThanOrEqual(totalFinalizadas),
      },
      order: {
        requiredReservations: 'DESC',
      },
    });

    if (
      mejorMembership &&
      user.membershipId !== mejorMembership.id
    ) {
      await this.userRepository.update(userId, {
        membershipId: mejorMembership.id,
      });
    }
  }

  async update(
    userId: number,
    data: UpdateUserDto,
    isSelfUpdate: boolean,
  ): Promise<User> {
    await this.findOne(userId);

    if (isSelfUpdate) {
      delete data.role;
      delete data.membershipId;
      delete data.isActive;
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    await this.userRepository.update(userId, data);
    return this.findOne(userId);
  }

  async updatePushToken(
    userId: number,
    expoPushToken: string,
  ): Promise<User> {
    await this.findOne(userId);
    await this.userRepository.update(userId, { expoPushToken });
    return this.findOne(userId);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      relations: ['reservations', 'membership'],
    });
  }

  async findOne(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['reservations', 'membership'],
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

  async remove(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['reservations'],
    });

    if (!user) throw new NotFoundException('User not found');

    const hoy = new Date();
    const tienePendientes = user.reservations.some(
      (r) => new Date(r.reservationDate) >= hoy,
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

  async updateLastLogin(userId: number): Promise<void> {
    await this.userRepository.update(
      { id: userId },
      { lastLoginDate: new Date() },
    );
  }

  async findById(userId: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id: userId } });
  }

  async updateRefreshTokenHash(
    userId: number,
    hash: string | null,
  ): Promise<void> {
    await this.userRepository.update(
      { id: userId },
      { refreshTokenHash: hash },
    );
  }
}

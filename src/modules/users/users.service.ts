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

  async updateUserRank(user_id: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: user_id },
      relations: ['membership'],
    });

    if (!user) return;

    const totalFinalizadas = await this.reservaRepository.count({
      where: {
        user_id,
        status: ReservationStatus.COMPLETED,
      },
    });

    const mejorMembership = await this.membresiaRepository.findOne({
      where: {
        required_reservations: LessThanOrEqual(totalFinalizadas),
      },
      order: {
        required_reservations: 'DESC',
      },
    });

    if (mejorMembership && user.membership_id !== mejorMembership.id) {
      await this.userRepository.update(user_id, {
        membership_id: mejorMembership.id,
      });
    }
  }

  async update(
    user_id: number,
    data: UpdateUserDto,
    isSelfUpdate: boolean,
  ): Promise<User> {
    await this.findOne(user_id);

    if (isSelfUpdate) {
      delete data.role;
      delete data.membership_id;
      delete data.is_active;
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    if (data.email) {
      const existingByEmail = await this.findByEmail(data.email);
      if (existingByEmail && existingByEmail.id !== user_id) {
        throw new BadRequestException('Email already exists');
      }
    }

    if (data.username) {
      const existingByUsername = await this.findByUserName(data.username);
      if (existingByUsername && existingByUsername.id !== user_id) {
        throw new BadRequestException('Username already exists');
      }
    }

    if (data.phone) {
      const existingByPhone = await this.findByPhone(data.phone);
      if (existingByPhone && existingByPhone.id !== user_id) {
        throw new BadRequestException('Phone already exists');
      }
    }

    try {
      await this.userRepository.update(user_id, data);
    } catch (error) {
      const dbError = error as { code?: string };
      if (dbError.code === '23505') {
        throw new BadRequestException('Email/Username/Phone already exists');
      }
      throw new InternalServerErrorException();
    }

    return this.findOne(user_id);
  }

  async updatePushToken(user_id: number, expoPushToken: string): Promise<User> {
    await this.findOne(user_id);
    await this.userRepository.update(user_id, { expoPushToken });
    return this.findOne(user_id);
  }

  async findAll(): Promise<any[]> {
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.membership', 'membership')
      .loadRelationCountAndMap('user.reservations_count', 'user.reservations')
      .getMany();
  }

  async findOne(user_id: number): Promise<any> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.membership', 'membership')
      .loadRelationCountAndMap('user.reservations_count', 'user.reservations') // Crea el campo virtual
      .where('user.id = :id', { id: user_id })
      .getOne();

    const totalReservationsCount = await this.reservaRepository.count({
      where: { user_id, status: ReservationStatus.COMPLETED },
    });

    if (!user) throw new NotFoundException('User not found');
    return { ...user, total_reservations: totalReservationsCount };
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

  async remove(user_id: number): Promise<void> {
    // 1. Buscamos el usuario con sus reservas
    const user = await this.userRepository.findOne({
      where: { id: user_id },
      relations: ['reservations'],
    });

    if (!user) throw new NotFoundException('User not found');

    //validacion de reservas pendientes (¡Mantenla, es buenísima!)
    const today = new Date();
    const hasPending = user.reservations.some(
      (r) => new Date(r.reservation_date) >= today,
    );

    if (hasPending) {
      throw new BadRequestException(
        'No puedes eliminar tu cuenta porque tienes reservas pendientes o activas.',
      );
    }

    //simulamos un borrado del user pq sino reservas se queda sin FK
    //asi que solo se hace update de su info para que simule un eliminado,
    // pero sin perder la integridad referencial de las reservas
    user.username = `deleted_user_${user_id}`;
    user.email = `deleted_${user_id}@deleted.com`;
    user.password = `DELETED_${Math.random().toString(36).substring(2)}`;
    user.refresh_token_hash = null; // O hashedRefreshToken = null, según tu implementación

    //Ponemos isactive a false
    user.is_active = false;
    //Guardamos los cambios en lugar de eliminar la fila
    await this.userRepository.save(user);
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

  async updateLastLogin(user_id: number): Promise<void> {
    await this.userRepository.update(
      { id: user_id },
      { last_login_date: new Date() },
    );
  }

  async updateLastIp(user_id: number, ip: string | null): Promise<void> {
    await this.userRepository.update({ id: user_id }, { last_ip: ip });
  }

  async findById(user_id: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id: user_id } });
  }

  async updateRefreshTokenHash(
    user_id: number,
    hash: string | null,
  ): Promise<void> {
    const result = await this.userRepository.update(
      { id: user_id },
      { refresh_token_hash: hash },
    );

    if (!result.affected) {
      throw new NotFoundException('User not found');
    }
  }

  //Funciones de email que se usan en authservice
  async setEmailVerificationData(
    user_id: number,
    tokenHash: string,
    expiresAt: Date,
  ): Promise<void> {
    const result = await this.userRepository.update(
      { id: user_id },
      {
        email_verified: false,
        email_verification_token_hash: tokenHash,
        email_verification_expires_at: expiresAt,
      },
    );

    if (!result.affected) {
      throw new NotFoundException('User not found');
    }
  }

  async findByEmailVerificationTokenHash(
    tokenHash: string,
  ): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email_verification_token_hash: tokenHash },
    });
  }

  async markEmailAsVerified(user_id: number): Promise<void> {
    const result = await this.userRepository.update(
      { id: user_id },
      {
        email_verified: true,
        email_verification_token_hash: null,
        email_verification_expires_at: null,
      },
    );

    if (!result.affected) {
      throw new NotFoundException('User not found');
    }
  }

  async setPasswordResetData(
    user_id: number,
    tokenHash: string,
    expiresAt: Date,
  ): Promise<void> {
    const result = await this.userRepository.update(
      { id: user_id },
      {
        password_reset_token_hash: tokenHash,
        password_reset_expires_at: expiresAt,
      },
    );

    if (!result.affected) {
      throw new NotFoundException('User not found');
    }
  }

  async findByPasswordResetTokenHash(tokenHash: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { password_reset_token_hash: tokenHash },
    });
  }

  //Se utiliza para limpiar el token de reset después de cambiar la contraseña, para que no se pueda reutilizar
  async clearPasswordResetData(user_id: number): Promise<void> {
    const result = await this.userRepository.update(
      { id: user_id },
      {
        password_reset_token_hash: null,
        password_reset_expires_at: null,
      },
    );

    if (!result.affected) {
      throw new NotFoundException('User not found');
    }
  }

  async changePassword(
    user_id: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: user_id })
      .addSelect('user.password')
      .getOne();

    if (!user) throw new NotFoundException('User not found');

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      throw new BadRequestException('Current password is incorrect');

    const hashed = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(user_id, { password: hashed });
  }

  async updatePassword(user_id: number, rawPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(rawPassword, 10);
    const result = await this.userRepository.update(
      { id: user_id },
      { password: hashedPassword },
    );

    if (!result.affected) {
      throw new NotFoundException('User not found');
    }
  }
}

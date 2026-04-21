import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User, UserRole } from './entities/user.entity';
import { UpdateUserDto } from './dto/users.dto';
import { Membresia } from '../membresia/entities/membresia.entity'; // Asegúrate de que la ruta sea correcta

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    //nos hace falta membresia pq aqui tendremos la logica que segun reservas 
    //que haya realizado , le meteremos una mambresia u otra automaticamente
    @InjectRepository(Membresia)
    private readonly membresiaRepository: Repository<Membresia>,
  ) {}

  //update automatico de membresia
  async updateUserRank(usuario_id: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { usuario_id },
      relations: ['reservas', 'membresia'],
    });

    if (!user) return;

    // Contamos reservas finalizadas
    const totalFinalizadas = user.reservas.filter(r => r.estado === 'FINALIZADA').length;

    // Buscamos en la tabla de membresías cuál le corresponde.
    // Buscamos la membresía con el mayor número de 'reservas_requeridas' 
    // que sea menor o igual a las que tiene el usuario.
    const mejorMembresia = await this.membresiaRepository.findOne({
      where: {
        reservas_requeridas: LessThanOrEqual(totalFinalizadas)
      },
      order: {
        reservas_requeridas: 'DESC' // La que pida más reservas (la mejor) primero
      }
    });

    if (mejorMembresia && user.membresia_id !== mejorMembresia.membresia_id) {
      await this.userRepository.update(usuario_id, { 
        membresia_id: mejorMembresia.membresia_id 
      });
    }
  }

  //update con proteccion de campos (Solo Admin cambia Role y Membresia)
  async update(usuario_id: number, data: UpdateUserDto, isSelfUpdate: boolean = false): Promise<User> {
    const user = await this.findOne(usuario_id);

    if (isSelfUpdate) {
      // Bloqueamos que el usuario se cambie estas cosas a sí mismo
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
      relations: ['reservas', 'membresia'] 
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
      if (error.code === '23505'){//controlamos duplicados aqui aunque en register ya se verifica
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
    const tienePendientes = user.reservas.some(r => new Date(r.fecha_reserva) >= hoy);

    if (tienePendientes) {
      throw new BadRequestException('You have pending reservations');
    }

    await this.userRepository.remove(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.createQueryBuilder("user")
      .where("user.email = :email", { email })
      .addSelect("user.password")
      .getOne();
  }

  async findByPhone(phone: string): Promise<User | null> {
    return await this.userRepository.createQueryBuilder("user")
      .where("user.phone = :phone", { phone })
      .getOne();
  }

  async findByUserName(username: string): Promise<User | null> {
    return await this.userRepository.createQueryBuilder("user")
      .where("user.username = :username", { username })
      .addSelect("user.password")
      .getOne();
  }

  async findByPhone(phone: string): Promise<User | null> {
    return await this.userRepository.createQueryBuilder("user")
      .where("user.phone = :phone", { phone })
      .addSelect("user.password")
      .getOne();
  }

  async updateLastLogin(usuario_id: number): Promise<void> {
    await this.userRepository.update({ usuario_id }, { fecha_ultimo_login: new Date() });
  }

  async findById(usuario_id: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { usuario_id } });
  }

  async updateRefreshTokenHash(usuario_id: number, hash: string | null): Promise<void> {
    await this.userRepository.update({ usuario_id }, { refresh_token_hash: hash });
  }
}
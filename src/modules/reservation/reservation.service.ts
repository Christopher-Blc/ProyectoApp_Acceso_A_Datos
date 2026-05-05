import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { estadoReserva, Reservation } from './entities/reservation.entity';
import { CreateReservationDto, UpdateReservationDto } from './dto/reservation.dto';
import { UserRole } from '../users/entities/user.entity';
import { Court } from '../court/entities/court.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservaRepo: Repository<Reservation>,
    @InjectRepository(Court)
    private readonly pistaRepo: Repository<Court>,
    private readonly userService: UsersService,
  ) {}

  async findAll(pista_id?: number, fecha_desde?: string): Promise<Reservation[]> {
    const where: any = {};

    if (pista_id) {
      where.court_id = pista_id;
    }

    if (fecha_desde) {
      where.reservation_date = MoreThanOrEqual(fecha_desde);
    }

    return this.reservaRepo.find({
      where,
      relations: ['usuario', 'court', 'payments'],
      order: { reservation_date: 'ASC', start_time: 'ASC' },
    });
  }

  async findOne(reserva_id: number): Promise<Reservation> {
    const reservation = await this.reservaRepo.findOne({
      where: { reservation_id: reserva_id },
      relations: ['usuario', 'court', 'payments'],
    });
    if (!reservation)
      throw new NotFoundException('No se ha encontrado esa reserva.');
    return reservation;
  }

  async findByUserId(usuario_id: number): Promise<Reservation[]> {
    if (!usuario_id) throw new ForbiddenException('No tienes permiso');
    return this.reservaRepo.find({
      where: { user_id: usuario_id },
      relations: ['usuario', 'court', 'payments'],
    });
  }

  async create(dto: CreateReservationDto, usuario_id: number): Promise<Reservation> {
    const Court = await this.pistaRepo.findOneBy({ court_id: dto.pista_id });
    if (!Court) throw new NotFoundException('Court no encontrada');

    //calculamos el precio final aqui para que no se hagan trampas desde el front
    const precioCalculado = this.calcularPrecio(
      Number(Court.price_per_hour),
      dto.hora_inicio,
      dto.hora_fin,
    );

    const newReservation = this.reservaRepo.create({
      ...dto,
      user_id: usuario_id,
      total_price: precioCalculado,
      status: estadoReserva.PENDING,
    });

    const saved = await this.reservaRepo.save(newReservation);
    return this.findOne(saved.reservation_id);
  }

  async update(
    reserva_id: number,
    dto: UpdateReservationDto,
    user_id: number,
    user_role: UserRole,
  ): Promise<Reservation> {
    const reservation = await this.findOne(reserva_id);

    // 1. Verificamos permisos de edición
    const isAdmin =
      user_role === UserRole.SUPER_ADMIN ||
      user_role === UserRole.ADMINISTRACION;

    if (reservation.user_id !== user_id && !isAdmin) {
      throw new ForbiddenException(
        'No tienes permiso para editar esta Reservation',
      );
    }

    // 2. Bloqueo: los clientes no pueden tocar reservas ya procesadas
    if (reservation.status !== estadoReserva.PENDING && !isAdmin) {
      throw new ForbiddenException(
        'No puedes modificar una reserva ya procesada.',
      );
    }

    // 3. Recalcular precio solo si cambian campos clave
    if (dto.pista_id || dto.hora_inicio || dto.hora_fin) {
      const id_Court = dto.pista_id || reservation.court_id;
      const h_inicio = dto.hora_inicio || reservation.start_time;
      const h_fin = dto.hora_fin || reservation.end_time;

      const Court = await this.pistaRepo.findOneBy({ court_id: id_Court });
      if (!Court) throw new NotFoundException('That Court does not exist');

      // Actualizamos el precio_total en el objeto que se guardará
      (dto as any).total_price = this.calcularPrecio(
        Number(Court.price_per_hour),
        h_inicio,
        h_fin,
      );
    }

    // 4. Lógica de rango de usuario (membresía)
    const estadoAnterior = reservation.status;
    const nuevoEstado = dto.estado;

    await this.reservaRepo.update(reserva_id, dto);

    // Si el estado cambia a FINALIZADA (o deja de serlo), actualizamos rango
    if (nuevoEstado && nuevoEstado !== estadoAnterior) {
      if (
        nuevoEstado === estadoReserva.COMPLETED ||
        estadoAnterior === estadoReserva.COMPLETED
      ) {
        await this.userService.updateUserRank(reservation.user_id);
      }

      // El contador aumenta si pasa a finalizada
      if (nuevoEstado === estadoReserva.COMPLETED) {
        await this.pistaRepo.increment(
          { court_id: reservation.court_id },
          'reservations_made',
          1,
        );
      }

      // Esto restaría el contador, pero en teoría no cambia tras finalizar
      // si (estadoAnterior === estadoReserva.CONFIRMADA && nuevoEstado === estadoReserva.CANCELADA) {
      //     await this.pistaRepo.decrement({ pista_id: Reservation.pista_id }, 'reservations_made', 1);
      // }
    }

    return this.findOne(reserva_id);
  }

  async remove(reserva_id: number): Promise<{ deleted: boolean }> {
    const reservation = await this.findOne(reserva_id);
    const eraFinalizada = reservation.status === estadoReserva.COMPLETED;

    await this.reservaRepo.delete(reservation.reservation_id);

    if (eraFinalizada) {
      await this.userService.updateUserRank(reservation.user_id);
    }

    return { deleted: true };
  }

  // Función que calcula el precio total según pista y franja horaria
  private calcularPrecio(
    pistaPrecio: number,
    inicio: string,
    fin: string,
  ): number {
    const [hI, mI] = inicio.split(':').map(Number);
    const [hF, mF] = fin.split(':').map(Number);

    const minutosInicio = hI * 60 + mI;
    const minutosFin = hF * 60 + mF;

    // Calculamos la diferencia
    let diferencia = minutosFin - minutosInicio;

    // Si es negativo (ej.: 23:00 a 01:00), pasó al día siguiente.
    // Sumamos 1440 para obtener la diferencia real en minutos.
    if (diferencia < 0) {
      diferencia += 1440;
    }

    // Si es 0, pusieron la misma hora (error)
    if (diferencia === 0) {
      throw new ForbiddenException(
        'La hora de inicio y fin no pueden ser iguales',
      );
    }

    const duracionHoras = diferencia / 60;

    // Devolvemos el precio final calculado
    return Number((duracionHoras * pistaPrecio).toFixed(2));
  }
}









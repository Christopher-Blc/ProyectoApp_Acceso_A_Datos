import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { Reservation, ReservationStatus } from './entities/reservation.entity';
import {
  CreateReservationDto,
  UpdateReservationDto,
} from './dto/reservation.dto';
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

  async findAll(
    court_id?: number,
    fromDate?: string,
  ): Promise<Reservation[]> {
    const where: any = {};

    if (court_id) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      where.court_id = court_id;
    }

    if (fromDate) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      where.reservation_date = MoreThanOrEqual(fromDate);
    }

    return this.reservaRepo.find({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      where,
      relations: ['user', 'court', 'payments'],
      order: { reservation_date: 'ASC', start_time: 'ASC' },
    });
  }

  async findOne(reservationId: number): Promise<Reservation> {
    const reservation = await this.reservaRepo.findOne({
      where: { id: reservationId },
      relations: ['user', 'court', 'payments'],
    });
    if (!reservation)
      throw new NotFoundException('No se ha encontrado esa reserva.');
    return reservation;
  }

  async findByUserId(user_id: number): Promise<Reservation[]> {
    if (!user_id) throw new ForbiddenException('No tienes permiso');
    return this.reservaRepo.find({
      where: { user_id },
      relations: ['user', 'court', 'payments'],
    });
  }

  async create(
    dto: CreateReservationDto,
    user_id: number,
  ): Promise<Reservation> {
    const court = await this.pistaRepo.findOneBy({ id: dto.court_id });
    if (!court) throw new NotFoundException('Court no encontrada');

    //calculamos el precio final aqui para que no se hagan trampas desde el front
    const precioCalculado = this.calcularPrecio(
      Number(court.price_per_hour),
      dto.start_time,
      dto.end_time,
    );

    const newReservation = this.reservaRepo.create({
      ...dto,
      user_id,
      total_price: precioCalculado,
      status: ReservationStatus.PENDING,
    });

    const saved = await this.reservaRepo.save(newReservation);
    return this.findOne(saved.id);
  }

  async update(
    reservationId: number,
    dto: UpdateReservationDto,
    user_id: number,
    user_role: UserRole,
  ): Promise<Reservation> {
    const reservation = await this.findOne(reservationId);

    // 1. Verificamos permisos de edición
    const isAdmin =
      user_role === UserRole.SUPER_ADMIN ||
      user_role === UserRole.ADMINISTRATION;

    if (reservation.user_id !== user_id && !isAdmin) {
      throw new ForbiddenException(
        'No tienes permiso para editar esta Reservation',
      );
    }

    // 2. Bloqueo: los clientes no pueden tocar reservas ya procesadas
    if (reservation.status !== ReservationStatus.PENDING && !isAdmin) {
      throw new ForbiddenException(
        'No puedes modificar una reserva ya procesada.',
      );
    }

    // 3. Recalcular precio solo si cambian campos clave
    if (dto.court_id || dto.start_time || dto.end_time) {
      const id_Court = dto.court_id || reservation.court_id;
      const h_inicio = dto.start_time || reservation.start_time;
      const h_fin = dto.end_time || reservation.end_time;

      const court = await this.pistaRepo.findOneBy({ id: id_Court });
      if (!court) throw new NotFoundException('That Court does not exist');

      // Actualizamos el precio_total en el objeto que se guardará
      const updatedDto = dto as Partial<Reservation>;
      updatedDto.total_price = this.calcularPrecio(
        Number(court.price_per_hour),
        h_inicio,
        h_fin,
      );
    }

    // 4. Lógica de rango de usuario (membresía)
    const estadoAnterior = reservation.status;
    const nuevoEstado = dto.status;

    await this.reservaRepo.update(reservationId, dto);

    // Si el estado cambia a FINALIZADA (o deja de serlo), actualizamos rango
    if (nuevoEstado && nuevoEstado !== estadoAnterior) {
      if (
        nuevoEstado === ReservationStatus.COMPLETED ||
        estadoAnterior === ReservationStatus.COMPLETED
      ) {
        await this.userService.updateUserRank(reservation.user_id);
      }

      // El contador aumenta si pasa a finalizada
      if (nuevoEstado === ReservationStatus.COMPLETED) {
        await this.pistaRepo.increment(
          { id: reservation.court_id },
          'reservations_made',
          1,
        );
      }

      // Esto restaría el contador, pero en teoría no cambia tras finalizar
      // si (estadoAnterior === estadoReserva.CONFIRMADA && nuevoEstado === estadoReserva.CANCELADA) {
      //     await this.pistaRepo.decrement({ pista_id: Reservation.pista_id }, 'reservations_made', 1);
      // }
    }

    return this.findOne(reservationId);
  }

  async remove(reservationId: number): Promise<{ deleted: boolean }> {
    const reservation = await this.findOne(reservationId);
    const eraFinalizada = reservation.status === ReservationStatus.COMPLETED;

    await this.reservaRepo.delete(reservation.id);

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

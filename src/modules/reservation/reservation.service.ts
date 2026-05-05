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
      where.pista_id = pista_id;
    }

    if (fecha_desde) {
      where.fecha_Reservation = MoreThanOrEqual(fecha_desde);
    }

    return this.reservaRepo.find({
      where,
      relations: ['usuario', 'Court', 'pagos'],
      order: { fecha_Reservation: 'ASC', hora_inicio: 'ASC' },
    });
  }

  async findOne(reserva_id: number): Promise<Reservation> {
    const reservation = await this.reservaRepo.findOne({
      where: { reserva_id },
      relations: ['usuario', 'Court', 'pagos'],
    });
    if (!reservation)
      throw new NotFoundException('No se ha encontrado esa reserva.');
    return reservation;
  }

  async findByUserId(usuario_id: number): Promise<Reservation[]> {
    if (!usuario_id) throw new ForbiddenException('No tienes permiso');
    return this.reservaRepo.find({
      where: { usuario_id },
      relations: ['usuario', 'Court', 'pagos'],
    });
  }

  async create(dto: CreateReservationDto, usuario_id: number): Promise<Reservation> {
    const Court = await this.pistaRepo.findOneBy({ pista_id: dto.pista_id });
    if (!Court) throw new NotFoundException('Court no encontrada');

    //calculamos el precio final aqui para que no se hagan trampas desde el front
    const precioCalculado = this.calcularPrecio(
      Number(Court.precio_hora),
      dto.hora_inicio,
      dto.hora_fin,
    );

    const newReservation = this.reservaRepo.create({
      ...dto,
      usuario_id,
      precio_total: precioCalculado,
      estado: estadoReserva.PENDIENTE,
    });

    const saved = await this.reservaRepo.save(newReservation);
    return this.findOne(saved.reserva_id);
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

    if (reservation.usuario_id !== user_id && !isAdmin) {
      throw new ForbiddenException(
        'No tienes permiso para editar esta Reservation',
      );
    }

    // 2. Bloqueo: los clientes no pueden tocar reservas ya procesadas
    if (reservation.estado !== estadoReserva.PENDIENTE && !isAdmin) {
      throw new ForbiddenException(
        'No puedes modificar una reserva ya procesada.',
      );
    }

    // 3. Recalcular precio solo si cambian campos clave
    if (dto.pista_id || dto.hora_inicio || dto.hora_fin) {
      const id_Court = dto.pista_id || reservation.pista_id;
      const h_inicio = dto.hora_inicio || reservation.hora_inicio;
      const h_fin = dto.hora_fin || reservation.hora_fin;

      const Court = await this.pistaRepo.findOneBy({ pista_id: id_Court });
      if (!Court) throw new NotFoundException('That Court does not exist');

      // Actualizamos el precio_total en el objeto que se guardará
      (dto as any).precio_total = this.calcularPrecio(
        Number(Court.precio_hora),
        h_inicio,
        h_fin,
      );
    }

    // 4. Lógica de rango de usuario (membresía)
    const estadoAnterior = reservation.estado;
    const nuevoEstado = dto.estado;

    await this.reservaRepo.update(reserva_id, dto);

    // Si el estado cambia a FINALIZADA (o deja de serlo), actualizamos rango
    if (nuevoEstado && nuevoEstado !== estadoAnterior) {
      if (
        nuevoEstado === estadoReserva.FINALIZADA ||
        estadoAnterior === estadoReserva.FINALIZADA
      ) {
        await this.userService.updateUserRank(reservation.usuario_id);
      }

      // El contador aumenta si pasa a finalizada
      if (nuevoEstado === estadoReserva.FINALIZADA) {
        await this.pistaRepo.increment(
          { pista_id: reservation.pista_id },
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
    const eraFinalizada = reservation.estado === estadoReserva.FINALIZADA;

    await this.reservaRepo.delete(reservation.reserva_id);

    if (eraFinalizada) {
      await this.userService.updateUserRank(reservation.usuario_id);
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









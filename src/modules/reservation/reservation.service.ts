import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { estadoReservation, Reservation } from './entities/reservation.entity';
import { CreateReservationDto, UpdateReservationDto } from './dto/reservation.dto';
import { UserRole } from '../users/entities/user.entity';
import { Court } from '../court/entities/court.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reserva)
    private readonly reservaRepo: Repository<Reserva>,
    @InjectRepository(Court)
    private readonly pistaRepo: Repository<Court>,
    private readonly userService: UsersService,
  ) {}

  async findAll(pista_id?: number, fecha_desde?: string): Promise<Reserva[]> {
    const where: any = {};

    if (pista_id) {
      where.pista_id = pista_id;
    }

    if (fecha_desde) {
      where.fecha_Reservation = MoreThanOrEqual(fecha_desde);
    }

    return this.reservaRepo.find({
      where,
      relations: ['usuario', 'pista', 'pagos'],
      order: { fecha_reserva: 'ASC', hora_inicio: 'ASC' },
    });
  }

  async findOne(reserva_id: number): Promise<Reserva> {
    const Reservation = await this.reservaRepo.findOne({
      where: { reserva_id },
      relations: ['usuario', 'pista', 'pagos'],
    });
    if (!reserva)
      throw new NotFoundException('No se ha encontrado esa reserva.');
    return reserva;
  }

  async findByUserId(usuario_id: number): Promise<Reserva[]> {
    if (!usuario_id) throw new ForbiddenException('No tienes permiso');
    return this.reservaRepo.find({
      where: { usuario_id },
      relations: ['usuario', 'pista', 'pagos'],
    });
  }

  async create(dto: CreateReservationDto, usuario_id: number): Promise<Reserva> {
    const Court = await this.pistaRepo.findOneBy({ pista_id: dto.pista_id });
    if (!Court) throw new NotFoundException('Court no encontrada');

    //calculamos el precio final aqui para que no se hagan trampas desde el front
    const precioCalculado = this.calcularPrecio(
      Number(pista.precio_hora),
      dto.hora_inicio,
      dto.hora_fin,
    );

    const newReservation = this.reservaRepo.create({
      ...dto,
      usuario_id,
      precio_total: precioCalculado,
      estado: estadoReserva.PENDIENTE,
    });

    const saved = await this.reservaRepo.save(newReserva);
    return this.findOne(saved.reserva_id);
  }

  async update(
    reserva_id: number,
    dto: UpdateReservationDto,
    user_id: number,
    user_role: UserRole,
  ): Promise<Reserva> {
    const Reservation = await this.findOne(reserva_id);

    // 1. Verificamos permisos de edición
    const isAdmin =
      user_role === UserRole.SUPER_ADMIN ||
      user_role === UserRole.ADMINISTRACION;

    if (reserva.usuario_id !== user_id && !isAdmin) {
      throw new ForbiddenException(
        'No tienes permiso para editar esta reserva',
      );
    }

    // 2. Block: Clients don't touch paid/processed reservations
    if (reserva.estado !== estadoReserva.PENDIENTE && !isAdmin) {
      throw new ForbiddenException(
        'You cannot modify an already processed reservation.',
      );
    }

    // 3. Price recalculation (only if key data changes and NOT paid, or if Admin)
    if (dto.pista_id || dto.hora_inicio || dto.hora_fin) {
      const id_Court = dto.pista_id || reserva.pista_id;
      const h_inicio = dto.hora_inicio || reserva.hora_inicio;
      const h_fin = dto.hora_fin || reserva.hora_fin;

      const Court = await this.pistaRepo.findOneBy({ pista_id: id_Court });
      if (!Court) throw new NotFoundException('That Court does not exist');

      // We update the precio_total in the object that will be saved
      (dto as any).precio_total = this.calcularPrecio(
        Number(pista.precio_hora),
        h_inicio,
        h_fin,
      );
    }

    // 4. User Rank Logic (Membership)
    const estadoAnterior = reserva.estado;
    const nuevoEstado = dto.estado;

    await this.reservaRepo.update(reserva_id, dto);

    // If the status changes to FINALIZADA (or stops being), we update the rank
    if (nuevoEstado && nuevoEstado !== estadoAnterior) {
      if (
        nuevoEstado === estadoReserva.FINALIZADA ||
        estadoAnterior === estadoReserva.FINALIZADA
      ) {
        await this.userService.updateUserRank(reserva.usuario_id);
      }

      // Counter increases if the status changes to completed
      if (nuevoEstado === estadoReserva.FINALIZADA) {
        await this.pistaRepo.increment(
          { pista_id: reserva.pista_id },
          'reservations_made',
          1,
        );
      }

      // This is to subtract the counter but in theory the status doesn't change after it's finalized
      // if (estadoAnterior === estadoReserva.CONFIRMADA && nuevoEstado === estadoReserva.CANCELADA) {
      //     await this.pistaRepo.decrement({ pista_id: reserva.pista_id }, 'reservations_made', 1);
      // }
    }

    return this.findOne(reserva_id);
  }

  async remove(reserva_id: number): Promise<{ deleted: boolean }> {
    const Reservation = await this.findOne(reserva_id);
    const eraFinalizada = reserva.estado === estadoReserva.FINALIZADA;

    await this.reservaRepo.delete(reserva.reserva_id);

    if (eraFinalizada) {
      await this.userService.updateUserRank(reserva.usuario_id);
    }

    return { deleted: true };
  }

  // Function that calculates the total price of the reservation according to the Court and start and end hours
  private calcularPrecio(
    pistaPrecio: number,
    inicio: string,
    fin: string,
  ): number {
    const [hI, mI] = inicio.split(':').map(Number);
    const [hF, mF] = fin.split(':').map(Number);

    const minutosInicio = hI * 60 + mI;
    const minutosFin = hF * 60 + mF;

    // We calculate the difference
    let diferencia = minutosFin - minutosInicio;

    // If it's negative (e.g.: 23:00 to 01:00), it's because it went to the next day.
    // We add 1440 to get the actual minutes difference.
    if (diferencia < 0) {
      diferencia += 1440;
    }

    // If it's 0, they put the same time (error)
    if (diferencia === 0) {
      throw new ForbiddenException(
        'Start time and end time cannot be the same',
      );
    }

    const duracionHoras = diferencia / 60;

    // Devolvemos el precio final bien calculado
    return Number((duracionHoras * pistaPrecio).toFixed(2));
  }
}





import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DayOfWeek, Court, CourtStatus } from './entities/court.entity';
import {
  Repository,
  In,
  MoreThanOrEqual,
  Between,
} from 'typeorm';
import { CreateCourtDto, UpdateCourtDto } from './dto/court.dto';
import {
  Reservation,
  ReservationStatus,
} from '../reservation/entities/reservation.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

@Injectable()
export class CourtService {
  constructor(
    @InjectRepository(Court)
    private readonly pistaRepo: Repository<Court>,
    @InjectRepository(Reservation)
    private readonly reservaRepo: Repository<Reservation>,
  ) {}

  async findAll(): Promise<Court[]> { 
    return this.pistaRepo.find({ 
      relations: ['installation', 'courtType'] 
    });
  }

  async findOne(courtId: number): Promise<Court> {
    const court = await this.pistaRepo.findOne({
      where: { id: courtId },
      // Añadimos 'courtType' aquí también
      relations: ['installation', 'courtType'],
    });
    if (!court) throw new NotFoundException(`Court not found`);
    return court;
  }

  private formatTime(time: string): string {
    if (!time) return time;
    // Forzamos HH:mm:00 recortando segundos que lleguen del front-end
    return `${time.slice(0, 5)}:00`;
  }

  async obtenerDisponibilidad(fechaString: string) {
    const fecha = new Date(fechaString);
    const dias = [
      DayOfWeek.SUNDAY,
      DayOfWeek.MONDAY,
      DayOfWeek.TUESDAY,
      DayOfWeek.WEDNESDAY,
      DayOfWeek.THURSDAY,
      DayOfWeek.FRIDAY,
      DayOfWeek.SATURDAY,
    ];

    const fechaAyer = new Date(fecha);
    fechaAyer.setDate(fecha.getDate() - 1);
    const nombreDiaHoy = dias[fecha.getDay()];
    const nombreDiaAyer = dias[fechaAyer.getDay()];

    // Buscamos pistas de hoy y ayer (por si alguna sigue abierta de madrugada)
    const pistas = await this.pistaRepo.find({
      where: [{ day_of_week: nombreDiaHoy }, { day_of_week: nombreDiaAyer }],
      relations: ['courtType'],
    });

    const pistasValidas = pistas.filter((p) => {
      if (p.day_of_week === nombreDiaHoy) return true;
      return p.closing_time < p.opening_time; // Solo si cruza medianoche
    });

    const reservasDelDia = await this.reservaRepo.find({
      where: { reservation_date: new Date(fechaString) },
    });

    return pistasValidas.map((court) => ({
      ...court,
      reservas_actuales: reservasDelDia
        .filter((r) => Number(r.court_id) === Number(court.id))
        .map((r) => ({ inicio: r.start_time, fin: r.end_time })),
    }));
  }

  async create(infoCourt: CreateCourtDto): Promise<Court> {
    const data = {
      ...infoCourt,
      opening_time: this.formatTime(infoCourt.opening_time),
      closing_time: this.formatTime(infoCourt.closing_time),
    };
    return this.pistaRepo.save(this.pistaRepo.create(data));
  }

  // Edita la pista con los datos recibidos y, cuando se pone en mantenimiento o inactiva,
  // cancela reservas futuras relacionadas. También puede recibir rango de fechas
  // para cancelar solo las reservas dentro de ese intervalo.
  async update(courtId: number, infoCourt: UpdateCourtDto): Promise<Court> {
    const currentCourt = await this.findOne(courtId);

    let dataNormalizada: QueryDeepPartialEntity<Court> = {
      ...infoCourt,
    } as QueryDeepPartialEntity<Court>;

    const apertura = infoCourt.opening_time ?? undefined;
    if (apertura)
      dataNormalizada = {
        ...dataNormalizada,
        opening_time: this.formatTime(apertura),
      } as QueryDeepPartialEntity<Court>;

    const cierre = infoCourt.closing_time ?? undefined;
    if (cierre)
      dataNormalizada = {
        ...dataNormalizada,
        closing_time: this.formatTime(cierre),
      } as QueryDeepPartialEntity<Court>;

    // Lógica de mantenimiento selectivo
    if (
      (infoCourt.status === CourtStatus.MAINTENANCE ||
        infoCourt.status === CourtStatus.INACTIVE) &&
      currentCourt.status !== infoCourt.status
    ) {
      const motivo =
        infoCourt.status === CourtStatus.INACTIVE
          ? 'The court has been removed from the system.'
          : 'Court cerrada por mantenimiento programado.';

      // Definimos el filtro de fechas
      const filtroFecha = MoreThanOrEqual(new Date(new Date().toISOString().split('T')[0]));

      await this.reservaRepo.update(
        {
          court_id: courtId,
          status: In([ReservationStatus.PENDING, ReservationStatus.CONFIRMED]),
          reservation_date: filtroFecha,
        },
        {
          status: ReservationStatus.CANCELLED,
          note: motivo,
        },
      );
    }

    await this.pistaRepo.update(courtId, dataNormalizada);
    return this.findOne(courtId);
  }

  async softDelete(courtId: number): Promise<void> {
    const hoy = new Date().toISOString().split('T')[0];

    // 1. Cancelamos las reservas futuras primero
    await this.reservaRepo.update(
      {
        court_id: courtId,
        status: In([ReservationStatus.PENDING, ReservationStatus.CONFIRMED]),
        reservation_date: MoreThanOrEqual(new Date(hoy)),
      },
      {
        status: ReservationStatus.CANCELLED,
        note: 'The court has been removed from the system.',
      },
    );

    await this.pistaRepo.update(courtId, {
      status: CourtStatus.INACTIVE,
    });
  }

  async remove(courtId: number): Promise<void> {
    const hoy = new Date().toISOString().split('T')[0];

    // 1. Cancelamos lo pendiente antes de que el ID deje de existir
    await this.reservaRepo.update(
      {
        court_id: courtId,
        status: In([ReservationStatus.PENDING, ReservationStatus.CONFIRMED]),
        reservation_date: MoreThanOrEqual(new Date(hoy)),
      },
      {
        status: ReservationStatus.CANCELLED,
        note: 'The court has been removed from the system.',
      },
    );
    await this.pistaRepo.delete(courtId);
  }
}

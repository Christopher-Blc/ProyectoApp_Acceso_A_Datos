import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiaSemana, Court, EstadoCourt } from './entities/court.entity';
import {
  Repository,
  In,
  MoreThanOrEqual,
  Between,
  
} from 'typeorm';
import { CourtDto, UpdateCourtDto } from './dto/court.dto';
import {
  Reservation,
  estadoReserva,
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
    return this.pistaRepo.find({ relations: ['Installation'] });
  }

  async findOne(court_id: number): Promise<Court> {
    const Court = await this.pistaRepo.findOne({
      where: { court_id },
      relations: ['Installation'],
    });
    if (!Court) throw new NotFoundException(`Court ${court_id} not found`);
    return Court;
  }

  private formatTime(time: string): string {
    if (!time) return time;
    // Forzamos HH:mm:00 recortando segundos que lleguen del front-end
    return `${time.slice(0, 5)}:00`;
  }

  async obtenerDisponibilidad(fechaString: string) {
    const fecha = new Date(fechaString);
    const dias = [
      DiaSemana.DOMINGO,
      DiaSemana.LUNES,
      DiaSemana.MARTES,
      DiaSemana.MIERCOLES,
      DiaSemana.JUEVES,
      DiaSemana.VIERNES,
      DiaSemana.SABADO,
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

    return pistasValidas.map((Court) => ({
      ...Court,
      reservas_actuales: reservasDelDia
        .filter((r) => Number(r.court_id) === Number(Court.court_id))
        .map((r) => ({ inicio: r.start_time, fin: r.end_time })),
    }));
  }

  async create(info_Court: CourtDto): Promise<Court> {
    const data = {
      ...info_Court,
      opening_time: this.formatTime(info_Court.opening_time),
      closing_time: this.formatTime(info_Court.closing_time),
    };
    return this.pistaRepo.save(this.pistaRepo.create(data));
  }

  // Edita la pista con los datos recibidos y, cuando se pone en mantenimiento o inactiva,
  // cancela reservas futuras relacionadas. También puede recibir rango de fechas
  // para cancelar solo las reservas dentro de ese intervalo.
  async update(court_id: number, info_Court: UpdateCourtDto): Promise<Court> {
    const pistaActual = await this.findOne(court_id);

    let dataNormalizada: QueryDeepPartialEntity<Court> = {
      ...info_Court,
    } as QueryDeepPartialEntity<Court>;

    const apertura = info_Court.opening_time ?? undefined;
    if (apertura)
      dataNormalizada = {
        ...dataNormalizada,
        opening_time: this.formatTime(apertura),
      } as QueryDeepPartialEntity<Court>;

    const cierre = info_Court.closing_time ?? undefined;
    if (cierre)
      dataNormalizada = {
        ...dataNormalizada,
        closing_time: this.formatTime(cierre),
      } as QueryDeepPartialEntity<Court>;

    // Lógica de mantenimiento selectivo
    if (
      (info_Court.status === EstadoCourt.MANTENIMIENTO ||
        info_Court.status === EstadoCourt.INACTIVA) &&
      pistaActual.status !== info_Court.status
    ) {
      const motivo =
        info_Court.status === EstadoCourt.INACTIVA
          ? 'La Court ha sido eliminada del sistema.'
          : 'Court cerrada por mantenimiento programado.';

      // Definimos el filtro de fechas
      const filtroFecha =
        info_Court.maintenance_start && info_Court.maintenance_end
          ? Between(
              new Date(info_Court.maintenance_start),
              new Date(info_Court.maintenance_end),
            )
          : MoreThanOrEqual(new Date(new Date().toISOString().split('T')[0]));

      await this.reservaRepo.update(
        {
          court_id: court_id,
          status: In([estadoReserva.PENDING, estadoReserva.CONFIRMED]),
          reservation_date: filtroFecha,
        },
        {
          status: estadoReserva.CANCELLED,
          nota: motivo,
        },
      );
    }

    await this.pistaRepo.update(court_id, dataNormalizada);
    return this.findOne(court_id);
  }

  async softDelete(court_id: number): Promise<void> {
    const hoy = new Date().toISOString().split('T')[0];

    // 1. Cancelamos las reservas futuras primero
    await this.reservaRepo.update(
      {
        court_id: court_id,
        status: In([estadoReserva.PENDING, estadoReserva.CONFIRMED]),

        reservation_date: MoreThanOrEqual(new Date(hoy)),
      },
      {
        status: estadoReserva.CANCELLED,
        nota: 'La Court ha sido eliminada del sistema.',
      },
    );

    await this.pistaRepo.update(court_id, {
      status: EstadoCourt.INACTIVA,
    });
  }

  async remove(court_id: number): Promise<void> {
    const hoy = new Date().toISOString().split('T')[0];

    // 1. Cancelamos lo pendiente antes de que el ID deje de existir
    await this.reservaRepo.update(
      {
        court_id: court_id,
        status: In([estadoReserva.PENDING, estadoReserva.CONFIRMED]),

        reservation_date: MoreThanOrEqual(new Date(hoy)),
      },
      {
        status: estadoReserva.CANCELLED,
        nota: 'La Court ha sido eliminada del sistema.',
      },
    );
    await this.pistaRepo.delete(court_id);
  }
}

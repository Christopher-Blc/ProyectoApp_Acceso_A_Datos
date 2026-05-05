import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiaSemana, Court, EstadoCourt } from './entities/court.entity';
import { Repository, In, MoreThanOrEqual, Between } from 'typeorm';
import { CourtDto, UpdateCourtDto } from './dto/court.dto';
import { Reservation, estadoReserva } from '../reservation/entities/reservation.entity';

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

  async findOne(pista_id: number): Promise<Court> {
    const Court = await this.pistaRepo.findOne({
      where: { pista_id },
      relations: ['Installation'],
    });
    if (!Court) throw new NotFoundException(`Court ${pista_id} not found`);
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
      where: [{ dia_semana: nombreDiaHoy }, { dia_semana: nombreDiaAyer }],
      relations: ['tipo_Court'],
    });

    const pistasValidas = pistas.filter((p) => {
      if (p.dia_semana === nombreDiaHoy) return true;
      return p.hora_cierre < p.hora_apertura; // Solo si cruza medianoche
    });

    const reservasDelDia = await this.reservaRepo.find({
      where: { fecha_Reservation: fechaString as any },
    });

    return pistasValidas.map((Court) => ({
      ...Court,
      reservas_actuales: reservasDelDia
        .filter((r) => Number(r.pista_id) === Number(Court.pista_id))
        .map((r) => ({ inicio: r.hora_inicio, fin: r.hora_fin })),
    }));
  }

  async create(info_Court: CourtDto): Promise<Court> {
    const data = {
      ...info_Court,
      hora_apertura: this.formatTime(info_Court.hora_apertura),
      hora_cierre: this.formatTime(info_Court.hora_cierre),
    };
    return this.pistaRepo.save(this.pistaRepo.create(data));
  }

  // Edita la pista con los datos recibidos y, cuando se pone en mantenimiento o inactiva,
  // cancela reservas futuras relacionadas. También puede recibir rango de fechas
  // para cancelar solo las reservas dentro de ese intervalo.
  async update(pista_id: number, info_Court: UpdateCourtDto): Promise<Court> {
    const pistaActual = await this.findOne(pista_id);
    const dataNormalizada: any = { ...info_Court };

    if (info_Court.hora_apertura)
      dataNormalizada.hora_apertura = this.formatTime(info_Court.hora_apertura);
    if (info_Court.hora_cierre)
      dataNormalizada.hora_cierre = this.formatTime(info_Court.hora_cierre);

    // Lógica de mantenimiento selectivo
    if (
      (info_Court.estado === EstadoCourt.MANTENIMIENTO || info_Court.estado === EstadoCourt.INACTIVA) &&
      pistaActual.estado !== info_Court.estado
    ) {
      const motivo = info_Court.estado === EstadoCourt.INACTIVA
        ? 'La Court ha sido eliminada del sistema.'
        : 'Court cerrada por mantenimiento programado.';

      // Definimos el filtro de fechas
      let filtroFecha: any;

      if (info_Court.mantenimiento_desde && info_Court.mantenimiento_hasta) {
        // CASO QUIRÚRGICO: Solo entre estas dos fechas
        filtroFecha = Between(
          info_Court.mantenimiento_desde,
          info_Court.mantenimiento_hasta
        );
      } else {
        // CASO GENERAL: De hoy en adelante
        filtroFecha = MoreThanOrEqual(new Date().toISOString().split('T')[0]);
      }

      await this.reservaRepo.update(
        {
          pista_id: pista_id,
          estado: In([estadoReserva.PENDIENTE, estadoReserva.CONFIRMADA]),
          fecha_Reservation: filtroFecha,
        },
        {
          estado: estadoReserva.CANCELADA,
          nota: motivo,
        },
      );
    }

    await this.pistaRepo.update(pista_id, dataNormalizada);
    return this.findOne(pista_id);
  }

  async softDelete(pista_id: number): Promise<void> {
    const hoy = new Date().toISOString().split('T')[0];

    // 1. Cancelamos las reservas futuras primero
    await this.reservaRepo.update(
      {
        pista_id: pista_id,
        estado: In([estadoReserva.PENDIENTE, estadoReserva.CONFIRMADA]),
        fecha_Reservation: MoreThanOrEqual(hoy as any),
      },
      {
        estado: estadoReserva.CANCELADA,
        nota: 'La Court ha sido eliminada del sistema.',
      },
    );

    await this.pistaRepo.update(pista_id, {
      estado: EstadoCourt.INACTIVA,
    });
  }

  async remove(pista_id: number): Promise<void> {
    const hoy = new Date().toISOString().split('T')[0];

    // 1. Cancelamos lo pendiente antes de que el ID deje de existir
    await this.reservaRepo.update(
      {
        pista_id: pista_id,
        estado: In([estadoReserva.PENDIENTE, estadoReserva.CONFIRMADA]),
        fecha_Reservation: MoreThanOrEqual(hoy as any),
      },
      {
        estado: estadoReserva.CANCELADA,
        nota: 'La Court ha sido eliminada del sistema.',
      },
    );
    await this.pistaRepo.delete(pista_id);
  }
}









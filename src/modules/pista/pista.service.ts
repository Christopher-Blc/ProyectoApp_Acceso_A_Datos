import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiaSemana, Pista, EstadoPista } from './entities/pista.entity';
import { Repository, In, MoreThanOrEqual } from 'typeorm';
import { PistaDto, UpdatePistaDto } from './dto/pista.dto';
import { Reserva, estadoReserva } from '../reserva/entities/reserva.entity';

@Injectable()
export class PistaService {
  constructor(
    @InjectRepository(Pista)
    private readonly pistaRepo: Repository<Pista>,
    @InjectRepository(Reserva)
    private readonly reservaRepo: Repository<Reserva>,
  ) {}

  async findAll(): Promise<Pista[]> {
    return this.pistaRepo.find({ relations: ['instalacion'] });
  }

  async findOne(pista_id: number): Promise<Pista> {
    const pista = await this.pistaRepo.findOne({
      where: { pista_id },
      relations: ['instalacion'],
    });
    if (!pista) throw new NotFoundException(`Pista ${pista_id} no encontrada`);
    return pista;
  }

  private formatTime(time: string): string {
    if (!time) return time;
    // Forzamos HH:mm:00 cortando cualquier segundo que venga del front
    return `${time.slice(0, 5)}:00`;
  }

  async obtenerDisponibilidad(fechaString: string) {
    const fecha = new Date(fechaString);
    const dias = [
      DiaSemana.DOMINGO, DiaSemana.LUNES, DiaSemana.MARTES, 
      DiaSemana.MIERCOLES, DiaSemana.JUEVES, DiaSemana.VIERNES, DiaSemana.SABADO
    ];
    
    const fechaAyer = new Date(fecha);
    fechaAyer.setDate(fecha.getDate() - 1);
    const nombreDiaHoy = dias[fecha.getDay()];
    const nombreDiaAyer = dias[fechaAyer.getDay()];

    // Buscamos pistas de hoy y de ayer (por si alguna sigue abierta de madrugada)
    const pistas = await this.pistaRepo.find({
      where: [{ dia_semana: nombreDiaHoy }, { dia_semana: nombreDiaAyer }],
      relations: ['tipo_pista'],
    });

    const pistasValidas = pistas.filter(p => {
      if (p.dia_semana === nombreDiaHoy) return true;
      return p.hora_cierre < p.hora_apertura; // Solo si cruza medianoche
    });

    const reservasDelDia = await this.reservaRepo.find({
      where: { fecha_reserva: fechaString as any }
    });

    return pistasValidas.map(pista => ({
      ...pista,
      reservas_actuales: reservasDelDia
        .filter(r => Number(r.pista_id) === Number(pista.pista_id))
        .map(r => ({ inicio: r.hora_inicio, fin: r.hora_fin }))
    }));
  }

  async create(info_pista: PistaDto): Promise<Pista> {
    const data = {
      ...info_pista,
      hora_apertura: this.formatTime(info_pista.hora_apertura),
      hora_cierre: this.formatTime(info_pista.hora_cierre),
    };
    return this.pistaRepo.save(this.pistaRepo.create(data));
  }

  async update(pista_id: number, info_pista: UpdatePistaDto): Promise<Pista> {
    const pistaActual = await this.findOne(pista_id);
    const dataNormalizada: any = { ...info_pista };

    if (info_pista.hora_apertura) dataNormalizada.hora_apertura = this.formatTime(info_pista.hora_apertura);
    if (info_pista.hora_cierre) dataNormalizada.hora_cierre = this.formatTime(info_pista.hora_cierre);

    // CANCELACIÓN MASIVA SI ENTRA EN MANTENIMIENTO
    if (info_pista.estado === EstadoPista.MANTENIMIENTO && pistaActual.estado !== EstadoPista.MANTENIMIENTO) {
      await this.reservaRepo.update(
        { 
          pista_id: pista_id, 
          estado: In([estadoReserva.PENDIENTE, estadoReserva.CONFIRMADA]),
          fecha_reserva: MoreThanOrEqual(new Date().toISOString().split('T')[0] as any)
        },
        { 
          estado: estadoReserva.CANCELADA,
          nota: 'Pista cerrada por mantenimiento (cancelación automática).' 
        }
      );
    }

    await this.pistaRepo.update(pista_id, dataNormalizada);
    return this.findOne(pista_id);
  }

  async remove(pista_id: number): Promise<void> {
    const hoy = new Date().toISOString().split('T')[0];

    // 1. Cancelamos lo pendiente antes de que el ID deje de existir
    await this.reservaRepo.update(
      { 
        pista_id: pista_id, 
        estado: In([estadoReserva.PENDIENTE, estadoReserva.CONFIRMADA]),
        fecha_reserva: MoreThanOrEqual(hoy as any)
      },
      { 
        estado: estadoReserva.CANCELADA,
        nota: 'La pista ha sido eliminada del sistema.' 
      }
    );
    await this.pistaRepo.delete(pista_id);
  }
}
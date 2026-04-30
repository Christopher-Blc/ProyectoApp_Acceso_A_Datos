import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Reservation } from '../../reserva/entities/reservation.entity';
import { Installation } from '../../instalacion/entities/installation.entity';
import { TipoCourt } from '../../tipo_pista/entities/court_type.entity';

export enum EstadoCourt {
  DISPONIBLE = 'DISPONIBLE',
  MANTENIMIENTO = 'MANTENIMIENTO',
  INACTIVA = 'INACTIVA',
}

export enum DiaSemana {
  LUNES = 'LUNES',
  MARTES = 'MARTES',
  MIERCOLES = 'MIERCOLES',
  JUEVES = 'JUEVES',
  VIERNES = 'VIERNES',
  SABADO = 'SABADO',
  DOMINGO = 'DOMINGO',
}
//para que solo haya una Court con el mismo nombre en la misma Installation y
// el mismo dia de la semana, pero puede haber pistas con el mismo nombre en
//  diferentes instalaciones o en la misma instalación pero en días diferentes
@Unique(['nombre', 'instalacion', 'dia_semana'])
@Entity('pista')
export class Court {
  @PrimaryGeneratedColumn({ name: 'pista_id', type: 'int' })
  pista_id: number;

  @Column({ name: 'instalacion_id', type: 'int' })
  instalacion_id: number;

  @Column({ name: 'tipo_pista_id', type: 'int' })
  tipo_pista_id: number;

  @Column({})
  nombre: string;

  @Column({ type: 'int' })
  capacidad: number;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  precio_hora: number;

  @Column({ type: 'boolean', default: false })
  cubierta: boolean;

  @Column({ type: 'boolean', default: false })
  iluminacion: boolean;

  @Column({})
  descripcion: string;

  @Column({
    type: 'enum',
    enum: EstadoCourt,
    default: EstadoPista.DISPONIBLE,
  })
  estado: EstadoPista;

  @Column({ type: 'time' })
  hora_apertura: string;

  @Column({ type: 'time' })
  hora_cierre: string;

  @Column({
    type: 'enum',
    enum: DiaSemana,
    default: DiaSemana.LUNES,
  })
  dia_semana: DiaSemana;

  @Column({ type: 'int', default: 0 })
  reservations_made: number;

  @ManyToOne(() => Installation, (i) => i.pistas)
  @JoinColumn({ name: 'instalacion_id' })
  instalacion: Instalacion;

  @ManyToOne(() => TipoCourt, (tp) => tp.pistas)
  @JoinColumn({ name: 'tipo_pista_id' })
  tipo_pista: TipoPista;

  @OneToMany(() => Reservation, (r) => r.Court)
  reservas: Reserva[];
}






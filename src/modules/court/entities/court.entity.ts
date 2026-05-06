import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Reservation } from '../../reservation/entities/reservation.entity';
import { Installation } from '../../installation/entities/installation.entity';
import { CourtType } from '../../court_type/entities/court_type.entity';

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
@Unique(['nombre', 'Installation', 'dia_semana'])
@Entity('Court')
export class Court {
  @PrimaryGeneratedColumn({ name: 'court_id', type: 'int' })
  court_id!: number;

  @Column({ name: 'installation_id', type: 'int' })
  installation_id!: number;

  @Column({ name: 'court_type_id', type: 'int' })
  court_type_id!: number;

  @Column({})
  nombre!: string;

  @Column({ type: 'int' })
  capacity!: number;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  price_per_hour!: number;

  @Column({ type: 'boolean', default: false })
  covered!: boolean;

  @Column({ type: 'boolean', default: false })
  lighting!: boolean;

  @Column({})
  description?: string;

  @Column({
    type: 'enum',
    enum: EstadoCourt,
    default: EstadoCourt.DISPONIBLE,
  })
  status!: EstadoCourt;

  @Column({ type: 'time' })
  opening_time!: string;

  @Column({ type: 'time' })
  closing_time!: string;

  @Column({
    type: 'enum',
    enum: DiaSemana,
    default: DiaSemana.LUNES,
  })
  day_of_week!: DiaSemana;

  @Column({ type: 'int', default: 0 })
  reservations_made!: number;

  @ManyToOne(() => Installation, (i) => i.courts)
  @JoinColumn({ name: 'installation_id' })
  Installation!: Installation;

  @ManyToOne(() => CourtType, (tp) => tp.courts)
  @JoinColumn({ name: 'court_type_id' })
  courtType!: CourtType;

  @OneToMany(() => Reservation, (r) => r.court)
  reservations!: Reservation[];
}

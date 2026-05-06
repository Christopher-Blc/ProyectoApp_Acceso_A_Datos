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

export enum CourtStatus {
  AVAILABLE = 'DISPONIBLE',
  MAINTENANCE = 'MANTENIMIENTO',
  INACTIVE = 'INACTIVA',
}

export enum DayOfWeek {
  MONDAY = 'LUNES',
  TUESDAY = 'MARTES',
  WEDNESDAY = 'MIERCOLES',
  THURSDAY = 'JUEVES',
  FRIDAY = 'VIERNES',
  SATURDAY = 'SABADO',
  SUNDAY = 'DOMINGO',
}
//para que solo haya una Court con el mismo nombre en la misma Installation y
// el mismo dia de la semana, pero puede haber pistas con el mismo nombre en
//  diferentes instalaciones o en la misma instalación pero en días diferentes
@Unique(['name', 'installation', 'dayOfWeek'])
@Entity('Court')
export class Court {
  @PrimaryGeneratedColumn({ name: 'court_id', type: 'int' })
  id!: number;

  @Column({ name: 'installation_id', type: 'int' })
  installationId!: number;

  @Column({ name: 'court_type_id', type: 'int' })
  courtTypeId!: number;

  @Column({})
  name!: string;

  @Column({ type: 'int' })
  capacity!: number;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  pricePerHour!: number;

  @Column({ type: 'boolean', default: false })
  isCovered!: boolean;

  @Column({ type: 'boolean', default: false })
  hasLighting!: boolean;

  @Column({})
  description?: string;

  @Column({
    type: 'enum',
    enum: CourtStatus,
    default: CourtStatus.AVAILABLE,
  })
  status!: CourtStatus;

  @Column({ type: 'time' })
  openingTime!: string;

  @Column({ type: 'time' })
  closingTime!: string;

  @Column({
    type: 'enum',
    enum: DayOfWeek,
    default: DayOfWeek.MONDAY,
  })
  dayOfWeek!: DayOfWeek;

  @Column({ type: 'int', default: 0 })
  reservationsMade!: number;

  @ManyToOne(() => Installation, (i) => i.courts)
  @JoinColumn({ name: 'installation_id' })
  installation!: Installation;

  @ManyToOne(() => CourtType, (tp) => tp.courts)
  @JoinColumn({ name: 'court_type_id' })
  courtType!: CourtType;

  @OneToMany(() => Reservation, (r) => r.court)
  reservations!: Reservation[];
}

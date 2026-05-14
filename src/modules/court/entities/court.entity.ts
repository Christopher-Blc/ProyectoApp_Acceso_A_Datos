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
import { Review } from 'src/modules/review/entities/review.entity';
import { max, min } from 'class-validator';

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
@Unique(['name', 'installation', 'day_of_week'])
@Entity('Court')
export class Court {
  @PrimaryGeneratedColumn({ name: 'court_id', type: 'int' })
  id!: number;

  @Column({ name: 'installation_id', type: 'int' })
  installation_id!: number;

  @Column({ name: 'court_type_id', type: 'int' })
  court_type_id!: number;

  @Column({})
  name!: string;

  @Column({ type: 'int' })
  capacity!: number;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  price_per_hour!: number;

  @Column({ name: 'is_covered', type: 'boolean', default: false })
  is_covered!: boolean;

  @Column({ name: 'has_lighting', type: 'boolean', default: false })
  has_lighting!: boolean;

  @Column({})
  description?: string;

  @Column({
    type: 'enum',
    enum: CourtStatus,
    default: CourtStatus.AVAILABLE,
  })
  status!: CourtStatus;

  @Column({ type: 'time' })
  opening_time!: string;

  @Column({ type: 'time' })
  closing_time!: string;

  @Column({
    name: 'day_of_week',
    type: 'enum',
    enum: DayOfWeek,
    default: DayOfWeek.MONDAY,
  })
  day_of_week!: DayOfWeek;

  @Column({ type: 'int', default: 0 })
  reservations_made!: number;

  @Column({ type: 'int', default: 0 })
  total_reviews!: number;

  @Column({ type: 'decimal', default: 0, precision: 2, scale: 1 })
  average_rating!: number;

  @ManyToOne(() => Installation, (i) => i.courts)
  @JoinColumn({ name: 'installation_id' })
  installation!: Installation;

  @ManyToOne(() => CourtType, (tp) => tp.courts)
  @JoinColumn({ name: 'court_type_id' })
  courtType!: CourtType;

  @OneToMany(() => Reservation, (r) => r.court)
  reservations!: Reservation[];

  @OneToMany(() => Review, (r) => r.court)
  reviews!: Review[];

}

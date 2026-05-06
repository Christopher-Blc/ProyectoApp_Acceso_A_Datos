import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Court } from '../../court/entities/court.entity';
import { Payment } from '../../payment/entities/payment.entity';

export enum ReservationStatus {
  PENDING = 'PENDIENTE', // Solicitada (ej.: esperando pago)
  CONFIRMED = 'CONFIRMADA', // Todo correcto, la plaza queda ocupada
  CANCELLED = 'CANCELADA', // Cancelada por usuario o admin (libera plaza)
  COMPLETED = 'FINALIZADA', // El evento terminó correctamente
  NO_SHOW = 'NO_PRESENTADO', // El usuario no asistió y no avisó (penalizable)
}

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn({ name: 'reservation_id', type: 'int' })
  id!: number;

  @Column({ name: 'user_id', type: 'int' })
  userId!: number;

  @Column({ name: 'court_id', type: 'int' })
  courtId!: number;

  @Column({ type: 'date' })
  reservationDate!: Date;

  @Column({ type: 'time' })
  startTime!: string;

  @Column({ type: 'time' })
  endTime!: string;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.PENDING,
  })
  status!: ReservationStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ nullable: true })
  note?: string;

  @ManyToOne(() => User, (u) => u.reservations)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Court, (c) => c.reservations)
  @JoinColumn({ name: 'court_id' })
  court!: Court;

  //reservation_id estara en Payment. he puesto onetomany aunque en teoria era onetoone
  //porque si falla un Payment queremos todos los registros de pagos asociados a la Reservation
  @OneToMany(() => Payment, (p) => p.reservation)
  payments!: Payment[]; // Esto es virtual, no crea una columna "Payment_id" en la tabla Reservation
}

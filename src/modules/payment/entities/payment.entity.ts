import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Reservation } from '../../reservation/entities/reservation.entity';

export enum PaymentMethod {
  VISA = 'Visa',
  MASTERCARD = 'MasterCard',
  PAY_PAL = 'PayPal',
  BIZUM = 'Bizum',
  EFECTIVO = 'Efectivo',
}

export enum PaymentStatus {
  PAGADO = 'Pagado',
  NO_PAGADO = 'No pagado',
  EN_PROCESO = 'En proceso',
  REEMBOLSADO = 'Reembolsado',
}

@Entity('Payment')
export class Payment {
  @PrimaryGeneratedColumn({ name: 'Payment_id' })
  Payment_id!: number;

  @Column({ name: 'reservation_id', type: 'int' })
  reservation_id!: number;

  // de momento como solo habra un poli no lo ponemos
  // @Column({ name: "instalacion_id" })
  // instalacion_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  payment_date!: Date;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.VISA,
  })
  payment_method!: PaymentMethod;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.NO_PAGADO,
  })
  payment_status!: PaymentStatus;

  @Column({ type: 'text', nullable: true })
  nota?: string;

  @ManyToOne(() => Reservation, (r) => r.payments)
  @JoinColumn({ name: 'reservation_id' })
  Reservation!: Reservation;

  // @ManyToOne(() => Installation)
  // @JoinColumn({ name: "instalacion_id" })
  // Installation: Installation;
}

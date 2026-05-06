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
  PAYPAL = 'PayPal',
  BIZUM = 'Bizum',
  CASH = 'Efectivo',
}

export enum PaymentStatus {
  PAID = 'Pagado',
  UNPAID = 'No pagado',
  IN_PROGRESS = 'En proceso',
  REFUNDED = 'Reembolsado',
}

@Entity('Payment')
export class Payment {
  @PrimaryGeneratedColumn({ name: 'payment_id' })
  id!: number;

  @Column({ name: 'reservation_id', type: 'int' })
  reservation_id!: number;

  // de momento como solo habra un poli no lo ponemos
  // @Column({ name: "instalacion_id" })
  // instalacion_id: number;

  @Column({ name: 'amount', type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Column({ name: 'payment_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  payment_date!: Date;

  @Column({
    name: 'payment_method',
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.VISA,
  })
  payment_method!: PaymentMethod;

  @Column({
    name: 'payment_status',
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.UNPAID,
  })
  payment_status!: PaymentStatus;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @ManyToOne(() => Reservation, (r) => r.payments)
  @JoinColumn({ name: 'reservation_id' })
  reservation!: Reservation;

  // @ManyToOne(() => Installation)
  // @JoinColumn({ name: "instalacion_id" })
  // Installation: Installation;
}

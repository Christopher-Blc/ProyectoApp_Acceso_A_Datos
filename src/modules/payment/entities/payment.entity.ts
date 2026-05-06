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
  reservationId!: number;

  // de momento como solo habra un poli no lo ponemos
  // @Column({ name: "instalacion_id" })
  // instalacion_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  paymentDate!: Date;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.VISA,
  })
  paymentMethod!: PaymentMethod;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.UNPAID,
  })
  paymentStatus!: PaymentStatus;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @ManyToOne(() => Reservation, (r) => r.payments)
  @JoinColumn({ name: 'reservation_id' })
  reservation!: Reservation;

  // @ManyToOne(() => Installation)
  // @JoinColumn({ name: "instalacion_id" })
  // Installation: Installation;
}

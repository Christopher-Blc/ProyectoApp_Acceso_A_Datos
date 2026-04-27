import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Reserva } from '../../reserva/entities/reserva.entity';

export enum metodo_pago {
  VISA = 'Visa',
  MASTERCARD = 'MasterCard',
  PAY_PAL = 'PayPal',
  BIZUM = 'Bizum',
  EFECTIVO = 'Efectivo',
}

export enum estado_pago {
  PAGADO = 'Pagado',
  NO_PAGADO = 'No pagado',
  EN_PROCESO = 'En proceso',
  REEMBOLSADO = 'Reembolsado',
}

@Entity('pago')
export class Pago {
  @PrimaryGeneratedColumn({ name: 'pago_id' })
  pago_id: number;

  @Column({ name: 'reserva_id', type: 'int' })
  reserva_id: number;

  // de momento como solo habra un poli no lo ponemos
  // @Column({ name: "instalacion_id" })
  // instalacion_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_pago: Date;

  @Column({
    type: 'enum',
    enum: metodo_pago,
    default: metodo_pago.VISA,
  })
  metodo_pago: metodo_pago;

  @Column({
    type: 'enum',
    enum: estado_pago,
    default: estado_pago.NO_PAGADO,
  })
  estado_pago: estado_pago;

  @Column({ type: 'text', nullable: true })
  nota?: string;

  @ManyToOne(() => Reserva, (r) => r.pagos)
  @JoinColumn({ name: 'reserva_id' })
  reserva: Reserva;

  // @ManyToOne(() => Instalacion)
  // @JoinColumn({ name: "instalacion_id" })
  // instalacion: Instalacion;
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Court } from '../../pista/entities/court.entity';
import { Payment } from '../../pago/entities/payment.entity';

export enum estadoReserva {
  PENDIENTE = 'PENDIENTE', // Requested (e.g.: waiting for payment)
  CONFIRMADA = 'CONFIRMADA', // All ok, the spot is taken
  CANCELADA = 'CANCELADA', // User or admin cancelled it (spot free)
  FINALIZADA = 'FINALIZADA', // The event passed successfully
  NO_PRESENTADO = 'NO_PRESENTADO', // User didn't show up and didn't notify (penalizable)
}

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn({ name: 'reserva_id', type: 'int' })
  reserva_id: number;

  @Column({ name: 'usuario_id', type: 'int' })
  usuario_id: number;

  @Column({ name: 'pista_id', type: 'int' })
  pista_id: number;

  @Column({ type: 'date' })
  fecha_reserva: Date;

  @Column({ type: 'time' })
  hora_inicio: string;

  @Column({ type: 'time' })
  hora_fin: string;

  @Column({
    type: 'enum',
    enum: estadoReservation,
    default: estadoReserva.PENDIENTE,
  })
  estado: estadoReserva;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio_total: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_creacion: Date;

  @Column()
  nota: string;

  @ManyToOne(() => User, (u) => u.reservas)
  @JoinColumn({ name: 'usuario_id' })
  usuario: User;

  @ManyToOne(() => Court, (pi) => pi.reservas)
  @JoinColumn({ name: 'pista_id' })
  pista: Pista;

  //reserva_Id estara en pago. he puesto onetomany aunque en teoria era onetoone
  //porque si falla un Payment queremos todos los registros de pagos asociados a la reserva
  @OneToMany(() => Payment, (pago) => pago.reserva)
  pagos: Payment[]; // Esto es virtual, no crea una columna "pago_id" en la tabla reserva
}





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
import { Court } from '../../court/entities/court.entity';
import { Payment } from '../../payment/entities/payment.entity';

export enum estadoReserva {
  PENDIENTE = 'PENDIENTE', // Solicitada (ej.: esperando pago)
  CONFIRMADA = 'CONFIRMADA', // Todo correcto, la plaza queda ocupada
  CANCELADA = 'CANCELADA', // Cancelada por usuario o admin (libera plaza)
  FINALIZADA = 'FINALIZADA', // El evento terminó correctamente
  NO_PRESENTADO = 'NO_PRESENTADO', // El usuario no asistió y no avisó (penalizable)
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
  fecha_Reservation: Date;

  @Column({ type: 'time' })
  hora_inicio: string;

  @Column({ type: 'time' })
  hora_fin: string;

  @Column({
    type: 'enum',
    enum: estadoReserva,
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
  Court: Court;

  //reserva_id estara en Payment. he puesto onetomany aunque en teoria era onetoone
  //porque si falla un Payment queremos todos los registros de pagos asociados a la Reservation
  @OneToMany(() => Payment, (Payment) => Payment.Reservation)
  pagos: Payment[]; // Esto es virtual, no crea una columna "Payment_id" en la tabla Reservation
}








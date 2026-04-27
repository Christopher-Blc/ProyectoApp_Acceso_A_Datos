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
import { Pista } from '../../pista/entities/pista.entity';
import { Pago } from '../../pago/entities/pago.entity';

export enum estadoReserva {
  PENDIENTE = 'PENDIENTE', // Se ha solicitado (ej: esperando pago)
  CONFIRMADA = 'CONFIRMADA', // Todo ok, el hueco está ocupado
  CANCELADA = 'CANCELADA', // El usuario o el admin la anularon (hueco libre)
  FINALIZADA = 'FINALIZADA', // El evento ya pasó con éxito
  NO_PRESENTADO = 'NO_PRESENTADO', // El usuario no vino y no avisó (penalizable)
}

@Entity()
export class Reserva {
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

  @ManyToOne(() => Pista, (pi) => pi.reservas)
  @JoinColumn({ name: 'pista_id' })
  pista: Pista;

  //reserva_Id estara en pago. he puesto onetomany aunque en teoria era onetoone
  //porque si falla un pago queremos todos los registros de pagos asociados a la reserva
  @OneToMany(() => Pago, (pago) => pago.reserva)
  pagos: Pago[]; // Esto es virtual, no crea una columna "pago_id" en la tabla reserva
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity'; // Importa la entidad User

export enum tipoNotification {
  AVISO = 'Aviso',
  RECORDATORIO = 'Recordatorio',
  ALERTA = 'Alerta',
  PROMOCION = 'Promocion',
}

@Entity({ name: 'notificacion' })
export class Notification {
  @PrimaryGeneratedColumn({ name: 'noti_id', type: 'int' })
  noti_id: number;

  @Column({ name: 'user_id', type: 'int' })
  user_id: number;

  @Column({ name: 'mensaje' })
  mensaje: string;

  @Column({
    name: 'tipoNoti',
    type: 'enum',
    enum: tipoNotification,
    default: tipoNoti.RECORDATORIO, // valor por defecto
  })
  tipoNoti: tipoNoti;

  @Column({ name: 'leida', default: false })
  leida: boolean;

  @Column({
    name: 'fecha',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fecha: Date;

  @ManyToOne(() => User, (user) => user.notificaciones)
  @JoinColumn({ name: 'user_id' })
  user: User;
}


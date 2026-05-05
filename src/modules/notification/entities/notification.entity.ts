import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity'; // Importa la entidad de usuario

export enum tipoNoti {
  ALERT = 'Aviso',
  REMINDER = 'Recordatorio',
  WARNING = 'Alerta',
  PROMOTION = 'Promocion',
}

export type NotificationType = tipoNoti;

@Entity({ name: 'notificacion' })
export class Notification {
  @PrimaryGeneratedColumn({ name: 'notification_id', type: 'int' })
  notification_id!: number;

  @Column({ name: 'user_id', type: 'int' })
  user_id!: number;

  @Column({ name: 'titulo', length: 100, nullable: true })
  title?: string;

  @Column({ name: 'mensaje' })
  message!: string;

  @Column({
    name: 'notification_type',
    type: 'enum',
    enum: tipoNoti,
    default: tipoNoti.REMINDER, // valor por defecto
  })
  notification_type!: tipoNoti;

  @Column({ name: 'leida', default: false })
  read!: boolean;

  @Column({
    name: 'fecha',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fecha!: Date;

  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: 'user_id' })
  user: User;
}





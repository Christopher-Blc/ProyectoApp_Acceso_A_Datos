import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity'; // Importa la entidad de usuario

export enum NotificationType {
  ALERT = 'Aviso',
  REMINDER = 'Recordatorio',
  WARNING = 'Alerta',
  PROMOTION = 'Promocion',
}

@Entity({ name: 'notificacion' })
export class Notification {
  @PrimaryGeneratedColumn({ name: 'notification_id', type: 'int' })
  id!: number;

  @Column({ name: 'user_id', type: 'int' })
  userId!: number;

  @Column({ name: 'titulo', length: 100, nullable: true })
  title?: string;

  @Column({ name: 'mensaje' })
  message!: string;

  @Column({
    name: 'notification_type',
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.REMINDER, // valor por defecto
  })
  notificationType!: NotificationType;

  @Column({ name: 'leida', default: false })
  isRead!: boolean;

  @Column({
    name: 'fecha',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: 'user_id' })
  user!: User;
}

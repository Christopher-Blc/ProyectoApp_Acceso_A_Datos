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
  user_id!: number;

  @Column({ name: 'title', length: 100, nullable: true })
  title?: string;

  @Column({ name: 'message' })
  message!: string;

  @Column({
    name: 'notification_type',
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.REMINDER,
  })
  notification_type!: NotificationType;

  @Column({ name: 'is_read', default: false })
  is_read!: boolean;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at!: Date;

  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: 'user_id' })
  user!: User;
}

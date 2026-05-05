import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { Notification } from '../../notification/entities/notification.entity';
import { Review } from '../../review/entities/review.entity';
import { Reservation } from '../../reservation/entities/reservation.entity';
import { Membership } from '../../membership/entities/membership.entity';

export enum UserRole {
  GESTOR_RESERVAS = 'GESTOR_RESERVAS',
  CLIENTE = 'CLIENTE',
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMINISTRACION = 'ADMINISTRACION',
}

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id', type: 'int' })
  usuario_id!: number;

  @Column({ name: 'Membership_id', type: 'int', nullable: true })
  Membership_id!: number;

  @Column({ name: 'username', unique: true })
  username!: string;

  @Column({ name: 'name' })
  name!: string;

  @Column({ name: 'surname' })
  surname!: string;

  @Column({ name: 'email', unique: true })
  email!: string;

  @Column({ name: 'phone' })
  phone!: string;

  @Column({ name: 'password', select: false })
  password!: string;

  @Column({
    name: 'role',
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENTE,
  })
  role!: UserRole;

  @Column({ name: 'isActive', default: true })
  isActive!: boolean;

  @Column({
    name: 'registration_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  registration_date!: Date;

  @Column({
    name: 'last_login_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  last_login_date!: Date;

  @Column({ name: 'date_of_birth', type: 'date' })
  date_of_birth!: Date;

  @Column({ name: 'address' })
  address!: string;

  @Column({ name: 'refresh_token_hash', type: 'text', nullable: true })
  refresh_token_hash!: string | null;

  @Column({ name: 'expo_push_token', type: 'text', nullable: true })
  expoPushToken!: string | null;

  @ManyToOne(() => Membership, (m) => m.users)
  @JoinColumn({ name: 'Membership_id' })
  Membership!: Membership;

  @OneToMany(() => Reservation, (r) => r.usuario)
  reservations!: Reservation[];

  @OneToMany(() => Notification, (n) => n.user)
  notifications!: Notification[];

  @OneToOne(() => Review, (r) => r.user)
  review!: Review;
}

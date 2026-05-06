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
  RESERVATION_MANAGER = 'GESTOR_RESERVAS',
  CLIENT = 'CLIENTE',
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMINISTRATION = 'ADMINISTRACION',
}

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id', type: 'int' })
  id!: number;

  @Column({ name: 'membership_id', type: 'int', nullable: true })
  membershipId!: number;

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
    default: UserRole.CLIENT,
  })
  role!: UserRole;

  @Column({ name: 'isActive', default: true })
  isActive!: boolean;

  @Column({
    name: 'registration_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  registrationDate!: Date;

  @Column({
    name: 'last_login_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastLoginDate!: Date;

  @Column({ name: 'date_of_birth', type: 'date' })
  dateOfBirth!: Date;

  @Column({ name: 'address' })
  address!: string;

  @Column({ name: 'refresh_token_hash', type: 'text', nullable: true })
  refreshTokenHash!: string | null;

  @Column({ name: 'expo_push_token', type: 'text', nullable: true })
  expoPushToken!: string | null;

  @ManyToOne(() => Membership, (m) => m.users)
  @JoinColumn({ name: 'membership_id' })
  membership!: Membership;

  @OneToMany(() => Reservation, (r) => r.user)
  reservations!: Reservation[];

  @OneToMany(() => Notification, (n) => n.user)
  notifications!: Notification[];

  @OneToOne(() => Review, (r) => r.user)
  review!: Review;
}

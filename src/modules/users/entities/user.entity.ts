import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Unique,
  OneToOne,
} from 'typeorm';
import { Noti } from '../../noti/entities/noti.entity';
import { Resenya } from '../../resenya/entities/resenya.entity';
import { Reserva } from '../../reserva/entities/reserva.entity';
import { Membresia } from '../../membresia/entities/membresia.entity';

export enum UserRole {
  GESTOR_RESERVAS = 'GESTOR_RESERVAS',
  CLIENTE = 'CLIENTE',
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMINISTRACION = 'ADMINISTRACION',
}

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn({ name: 'usuario_id', type: 'int' })
  usuario_id: number;

  @Column({ name: 'membresia_id', type: 'int', nullable: true })
  membresia_id: number;

  @Column({ name: 'username', unique: true })
  username: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'surname' })
  surname: string;

  @Column({ name: 'email', unique: true })
  email: string;

  @Column({ name: 'phone' })
  phone: string;

  @Column({ name: 'password', select: false })
  password: string;

  @Column({
    name: 'role',
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENTE,
  })
  role: UserRole;

  @Column({ name: 'isActive', default: true })
  isActive: boolean;

  @Column({
    name: 'fecha_registro',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fecha_registro: Date;

  @Column({
    name: 'fecha_ultimo_login',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fecha_ultimo_login: Date;

  @Column({ name: 'fecha_nacimiento', type: 'date' })
  fecha_nacimiento: Date;

  @Column({ name: 'direccion' })
  direccion: string;

  @Column({ name: 'refresh_token_hash', type: 'text', nullable: true })
  refresh_token_hash: string | null;

  @ManyToOne(() => Membresia, (m) => m.users)
  @JoinColumn({ name: 'membresia_id' })
  membresia: Membresia;

  @OneToMany(() => Reserva, (r) => r.usuario)
  reservas: Reserva[];

  @OneToMany(() => Noti, (n) => n.user)
  notificaciones: Noti[];

  @OneToOne(() => Resenya, (r) => r.user)
  resenya: Resenya;
}

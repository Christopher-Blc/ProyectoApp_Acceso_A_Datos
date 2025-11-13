import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { Noti } from "../noti/noti.entity";  // Importa la entidad Noti
import { Comentario } from "../comentario/comentario.entity";
import { Reserva } from "../reserva/reserva.entity";
import { Membresia } from "../membresia/membresia.entity";
import { Pago } from "../pago/pago.entity";


export enum UserRole {
    GESTOR_RESERVAS = "GESTOR_RESERVAS",
    ADMINISTRACION = "ADMINISTRACION",
    CLIENTE = "CLIENTE",
    MANTENIMIENTO = "MANTENIMIENTO",
    SUPER_ADMIN = "SUPER_ADMIN",
}
@Entity()
export class User {
  @PrimaryGeneratedColumn({type: "int"})
  usuario_id: number;

  @OneToMany(() => Noti, noti => noti.user)
  notificaciones: Noti[];

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  email: string;

  @Column()
  phone: number;

  @Column()
  password: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.CLIENTE,
  })
  role: UserRole;
  

  @Column()
  isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_registro: Date;


  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_ultimo_login: Date;

  @Column()
  fecha_nacimiento: Date;

  @Column()
  direccion: string;

  @ManyToOne(() => Membresia, membresia => membresia.users)
  membresia: Membresia;

  @OneToMany(() => Comentario, comentario => comentario.user)
  comentarios: Comentario[];

  @OneToMany(() => Pago, pago => pago.usuario)
  pagos: Pago[];

  @ManyToMany(() => Reserva, reserva => reserva.usuarios)
  @JoinTable()
  reservas: Reserva[];

}
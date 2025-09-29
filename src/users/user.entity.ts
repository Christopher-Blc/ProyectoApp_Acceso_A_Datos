import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Timestamp } from "typeorm/browser";

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

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  email: string;

  @Column()
  phone: string;

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

  @Column()
  fecha_registro: Timestamp;

  @Column()
  fecha_ultimo_login: Timestamp;

  @Column()
  fecha_nacimiento: Date;

  @Column()
  direccion: string;


}
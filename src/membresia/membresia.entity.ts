import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { User } from "../users/user.entity";


export enum estado_instalacion {
  ACTIVA = "activa",
  EN_MANTENIMIENTO = "En mantenimiento",
  INACTIVA = "Inactiva"
}

@Entity()
export class Membresia {
  @PrimaryGeneratedColumn({type: "int"})
  membresia_id: number;

  @Column({type: "int"})
  usuario_id: number;//llave secundairia que viene de la tabla usuario

  @Column()
  tipo: string;

  @Column()
  frcha_inicio: Date;

  @Column()
  fecha_fin: Date;

  @Column({
    type: "enum",
    enum: estado_instalacion,
    default: estado_instalacion.INACTIVA, // valor por defecto
  })
  estado: estado_instalacion;

  @Column({type: "decimal", precision: 10, scale: 2})
  descuento: number;

  @Column()
  renovable: boolean;

  @Column()
  fecha_renovacion: Date;

  @OneToMany(() => User, user => user.membresia)
  users: User[];

}
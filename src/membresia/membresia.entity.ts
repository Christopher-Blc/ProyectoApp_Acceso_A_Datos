import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { User } from "../users/user.entity";


export enum estado_membresia {
  FINALIZADA = "finalizada",
  A_PAGAR = "a_pagar",
  CONFIRMADA = "confirmada",
  ACTIVA = "activa"
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
    enum: estado_membresia,
    default: estado_membresia.FINALIZADA, // valor por defecto
  })
  estado: estado_membresia;

  @Column({type: "decimal", precision: 10, scale: 2})
  descuento: number;

  @Column()
  renovable: boolean;

  @Column()
  fecha_renovacion: Date;

  @OneToMany(() => User, user => user.membresia)
  users: User[];

}
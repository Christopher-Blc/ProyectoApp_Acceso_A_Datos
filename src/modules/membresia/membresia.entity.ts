import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, ManyToOne, JoinColumn } from "typeorm";
import { User } from "../users/user.entity";


export enum estado_membresia {
  FINALIZADA = "finalizada",
  A_PAGAR = "a_pagar",
  CONFIRMADA = "confirmada",
  ACTIVA = "activa"
}

@Entity()
export class Membresia {
  @PrimaryGeneratedColumn({name: "membresia_id", type: "int"})
  membresia_id: number;

  @Column({name: "usuario_id", type: "int"})
  usuario_id: number;//llave secundairia que viene de la tabla usuario

  @Column()
  tipo: string;

  @Column()
  fecha_inicio: Date;

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

  @ManyToOne(() => User, (u) => u.membresia)
  @JoinColumn({ name: "usuario_id" })
  user: User;

}
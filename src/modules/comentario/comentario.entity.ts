import { Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToOne, JoinColumn } from "typeorm";
import { User } from "../users/user.entity";
import { Reserva } from "../reserva/reserva.entity";
import { Pista } from "../pista/pista.entity"; // Importa la entidad Pista

@Entity()
export class Comentario {
  @PrimaryGeneratedColumn({name: "comentario_id", type: "int" })
  comentario_id: number;

  @Column({name: "pista_id", type: "int" }) // Clave FK hacia Pista
  pista_id: number;

  @Column({name: "usuario_id", type: "int" }) // Clave FK hacia Usuario
  usuario_id: number;

  @Column()
  titulo: string;

  @Column()
  texto: string;

  @Column({type: "int"})
  calificacion: number;

  @Column()
  fecha_comentario: Date;

  @Column()
  visible: boolean;

  @ManyToOne(() => User, (u) => u.comentarios)
  @JoinColumn({ name: "usuario_id" })
  user: User;

  @ManyToOne(() => Pista, (pi) => pi.comentarios)
  @JoinColumn({ name: "pista_id" })
  pista: Pista;
}

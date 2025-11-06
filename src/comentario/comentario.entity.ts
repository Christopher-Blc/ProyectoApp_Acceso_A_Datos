import { Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToOne } from "typeorm";
import { User } from "../users/user.entity";
import { Reserva } from "../reserva/reserva.entity";
import { Pista } from "../pista/pista.entity"; // Importa la entidad Pista

@Entity()
export class Comentario {
  @PrimaryGeneratedColumn({ type: "int" })
  comentario_id: number;

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

  @ManyToOne(() => User, user => user.comentarios)
  user: User;

  @OneToOne(() => Reserva, reserva => reserva.reserva_id)
  reserva: Reserva;
  
  @ManyToOne(() => Pista, pista => pista.comentarios)
  pista: Pista;
}

import { Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToOne } from "typeorm";
import { Timestamp } from "typeorm/browser";
import { User } from "src/users/user.entity";
import { Reserva } from "src/reserva/reserva.entity";
import { Pista } from "src/pista/pista.entity"; // Importa la entidad Pista

@Entity()
export class Comentario {
  @PrimaryGeneratedColumn({ type: "int" })
  comentario_id: number;

  @Column()
  titulo: string;

  @Column()
  texto: String;

  @Column({type: "int"})
  calificacion: number;

  @Column()
  fecha_comentario: Timestamp;

  @Column()
  visible: boolean;

  @OneToOne(() => User, user => user.usuario_id)
  user: User;

  @OneToOne(() => Reserva, reserva => reserva.reserva_id)
  reserva: Reserva;
  
  @ManyToOne(() => Pista, pista => pista.comentarios)
  pista: Pista;
}

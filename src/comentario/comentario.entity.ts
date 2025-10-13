import { Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToOne } from "typeorm";
import { User } from "src/users/user.entity";
import { Reserva } from "src/reserva/reserva.entity";
import { Pista } from "src/pista/pista.entity"; // Importa la entidad Pista

@Entity()
export class Comentario {
  @PrimaryGeneratedColumn({ type: "int" })
  reserva_id: number;

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

  @OneToOne(() => User, user => user.usuario_id)
  user: User;

  @OneToOne(() => Reserva, reserva => reserva.reserva_id)
  reserva: Reserva;
  
  @ManyToOne(() => Pista, pista => pista.comentarios)
  pista: Pista;
}

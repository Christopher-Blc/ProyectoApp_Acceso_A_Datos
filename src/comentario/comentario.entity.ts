import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from "typeorm";
import { Timestamp } from "typeorm/browser";
import { User } from "src/users/user.entity";
import { Reserva } from "src/reserva/reserva.entity";

@Entity()
export class Comentario {
  @PrimaryGeneratedColumn({ type: "int" })
  reserva_id: number;

  @Column()
  titulo: string;

  @Column()
  texto: Text;

  @Column({type: "int"})
  calificacion: number;

  @Column()
  fecha_comentario: Timestamp;

  @Column()
  visible: boolean;

  @OneToOne(() => User, users => users.usuario_id)
  users: User;

  @OneToOne(() => Reserva, reserva => reserva.reserva_id)
  reserva: Reserva;
}

import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Timestamp } from "typeorm/browser";

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
}
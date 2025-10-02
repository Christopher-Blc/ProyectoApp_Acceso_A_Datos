import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany } from "typeorm";
import { Timestamp } from "typeorm/browser";
import { User } from "src/users/user.entity";  // Importa la entidad User
import { Comentario } from "src/comentario/comentario.entity"; // Importa la entidad Comentario

export enum estadoReserva {
    CONFIRMADA = "CONFIRMADA",
    FINALIZADA = "FINALIZADA",
    PAUSADA = "PAUSADA",
    CANCELADA = "CANCELADA",
    NO_PRESENTADO = "NO_PRESENTADO",
    PENDIENTE = "PENDIENTE",
}

@Entity()
export class Reserva {
  @PrimaryGeneratedColumn({ type: "int" })
  reserva_id: number;

  @Column()
  fecha_reserva: Date;

  @Column()
  fecha_inicio: Date;

  @Column()
  fecha_fin: Date;

  @Column({
    type: "enum",
    enum: estadoReserva,
    default: estadoReserva.PENDIENTE,
  })
  estado: estadoReserva;

  @Column({type: "decimal", precision: 10, scale: 2})
  precio_total: number;

  @Column()
  fecha_creacion: Timestamp;

  @Column()
  codigo_reserva: string;

  @Column()
  nota: string;

  @ManyToMany(() => User, user => user.reservas)
  usuarios: User[];

  @OneToMany(() => Comentario, comentario => comentario.reserva)
  comentarios: Comentario[];
}
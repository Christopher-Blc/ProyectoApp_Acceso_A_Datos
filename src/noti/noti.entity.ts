import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, ManyToOne, JoinColumn } from "typeorm";
import { User } from "../users/user.entity"; // Importa la entidad User

export enum tipoNoti {
  AVISO = 'Aviso',
  RECORDATORIO = 'Recordatorio',
  ALERTA = 'Alerta',
  PROMOCION = 'Promocion',
}

@Entity({ name: "notificacion" })
export class Noti {
  @PrimaryGeneratedColumn({name: "noti_id", type: "int"})
  noti_id: number;

  @Column({ name: "mensaje" })
  mensaje: string;

  @Column({
    name: "tipoNoti",
    type: "enum",
    enum: tipoNoti,
    default: tipoNoti.RECORDATORIO, // valor por defecto
  })
  tipoNoti: tipoNoti;

  @Column({ name: "leida" })
  leida: boolean;

  @Column()
  fecha: Date;

   @ManyToOne(() => User, user => user.notificaciones)
  user: User;

}
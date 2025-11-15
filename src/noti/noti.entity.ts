import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, ManyToOne } from "typeorm";
import { User } from "../users/user.entity"; // Importa la entidad User

export enum tipoNoti {
  AVISO = 'Aviso',
  RECORDATORIO = 'Recordatorio',
  ALERTA = 'Alerta',
  PROMOCION = 'Promocion',
}

@Entity("notificacion")
export class Noti {
  @PrimaryGeneratedColumn({type: "int"})
  noti_id: number;

  @Column()
  mensaje: string;

  @Column({
    type: "enum",
    enum: tipoNoti,
    default: tipoNoti.RECORDATORIO, // valor por defecto
  })
  tipoNoti: tipoNoti;

  @Column()
  leida: boolean;

  @Column({type: "datetime"})
  fecha: Date;

  @ManyToOne(() => User, user => user.notificaciones)
  user: User;

}
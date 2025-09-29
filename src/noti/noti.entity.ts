import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Timestamp } from "typeorm/browser";

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

  @Column({type: "int"})
  user_id: number; // Clave foranea de usuario

  @Column()
  mensaje: string;

  @Column({
    type: "enum",
    enum: tipoNoti,
    default: tipoNoti.RECORDATORIO, // valor por defecto
  })
  tipoNoti: tipoNoti;

  @Column()
  canal: string;

  @Column()
  leida: boolean;

  @Column()
  fecha: Timestamp;
}
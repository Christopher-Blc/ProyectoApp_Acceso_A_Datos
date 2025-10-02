import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, ManyToOne } from "typeorm";
import { Timestamp } from "typeorm/browser";
import { User } from "src/users/user.entity"; // Importa la entidad User

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
  usuario_id: number;

  @ManyToOne(() => User, user => user.notificaciones)
  user: User;

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
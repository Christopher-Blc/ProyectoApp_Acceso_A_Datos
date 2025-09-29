import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

export enum dia_semana {
  LUNES = "Lunes",
  MARTES = "Martes",
  MIERCOLES = "Miercoles",
  JUEVES = "Jueves",
  VIERNES = "Viernes",
  SABADO = "Sabado",
  DOMINGO = "Domingo"
}

@Entity()
export class User {
  @PrimaryGeneratedColumn({type: "int"})
  horario_id: number;

  @Column()
  pista_id: string;//llave secundaria que viene de la tabla pista

  @Column({
    type: "enum",
    enum: dia_semana,
    default: dia_semana.LUNES, // valor por defecto
  })
  dia_semana: dia_semana;

  

  @Column()
  hora_apertura: Date;//Time

  @Column()
  hora_cierre: Date;//Time

  @Column({type: "int"})
  intervalos_minutos: number;


}
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Pista } from "../pista/pista.entity"; // Importa la entidad Pista

export enum dia_semana {
  LUNES = "Lunes",
  MARTES = "Martes",
  MIERCOLES = "Miercoles",
  JUEVES = "Jueves",
  VIERNES = "Viernes",
  SABADO = "Sabado",
  DOMINGO = "Domingo"
}

@Entity("horario_pista")
export class Horario_Pista {
  @PrimaryGeneratedColumn({name: "horario_id", type: "int"})
  horario_id: number;

  @Column({name: "pista_id", type: "int"})
  pista_id: number;//llave secundaria que viene de la tabla pista

  @Column({
    type: "enum",
    enum: dia_semana,
    default: dia_semana.LUNES, // valor por defecto
  })
  dia_semana: dia_semana;

  

  @Column({ type: "time" })
  hora_apertura: Date;//Time

  @Column({ type: "time" })
  hora_cierre: Date;//Time

  @Column({type: "int"})
  intervalos_minutos: number;

 @ManyToOne(() => Pista, (pi) => pi.horarios_pista)
 @JoinColumn({ name: "pista_id" })
 pista: Pista;
}
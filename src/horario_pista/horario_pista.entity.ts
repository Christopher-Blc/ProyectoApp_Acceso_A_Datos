import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
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
  @PrimaryGeneratedColumn({type: "int"})
  horario_id: number;

  @Column({type: "int"})
  pista_id: number;//llave secundaria que viene de la tabla pista

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

 @ManyToOne(() => Pista, pista => pista.horarios_pista)
 pista: Pista;
}
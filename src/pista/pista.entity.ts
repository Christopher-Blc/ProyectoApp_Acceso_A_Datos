import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Reserva } from "../reserva/reserva.entity"; // Importa la entidad Reserva
import { Comentario } from "../comentario/comentario.entity"; // Importa la entidad Comentario
import { Horario_Pista } from "../horario_pista/horario_pista.entity"; // Importa la entidad Horario_Pista
import { Instalacion } from "../instalacion/instalacion.entity"; // Importa la entidad Instalacion

export enum tipo_pista {
  TENIS = 'TENNIS',
  PADEL = 'PADEL',
  FUTBOL_7 = 'FUTBOL_7',
  FUTBOL_SALA = 'FUTBOL_SALA',
  BALONCESTO = 'BALONCESTO',
  OTRO = 'OTRO',
}

export enum CoberturaPista {
  CUBIERTA = "CUBIERTA",
  DESCUBIERTA = "DESCUBIERTA",
}

export enum EstadoPista {
  DISPONIBLE = "DISPONIBLE",
  MANTENIMIENTO = "MANTENIMIENTO",
  RESERVADA = 'RESERVADA',
  INACTIVA = 'INACTIVA',
}

@Entity("pista")
export class Pista {
  @PrimaryGeneratedColumn({name: "pista_id", type: "int"})
  pista_id: number;

  @Column({name: "instalacion_id", type: "int"}) 
  instalacion_id: number; // clave foranea instalacion

  @Column({
      type: "enum",
      enum: tipo_pista,
      default: tipo_pista.OTRO, // valor por defecto
    })
    tipo_Pista: tipo_pista;

  @Column({type: "int"})
  capacidad: number;

  @Column({type: "decimal", precision: 8, scale: 2})
  precio_hora: number;

   @Column({
    type: "enum",
    enum: CoberturaPista,
  })
  cobertura: CoberturaPista;

  @Column({ default: false })
  iluminacion: boolean;

  @Column({ type: "text"})
  descripcion: string;

  @Column({
    type: "enum",
    enum: EstadoPista,
    default: EstadoPista.DISPONIBLE,
  })
  estado: EstadoPista;

  @Column()
  numero: number;

  @OneToMany(() => Reserva, (r) => r.pista)
  reservas: Reserva[];

  @OneToMany(() => Comentario, (c) => c.pista)
  comentarios: Comentario[];

  @OneToMany(() => Horario_Pista, (hp) => hp.pista)
  horarios_pista: Horario_Pista[];

  @ManyToOne(() => Instalacion, (i) => i.pista)
  @JoinColumn({ name: "instalacion_id" })
  instalacion: Instalacion;

}
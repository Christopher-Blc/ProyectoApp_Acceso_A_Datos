import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

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
  @PrimaryGeneratedColumn({type: "int"})
  pista_id: number;

  @Column({type: "int"})
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
  numero: string;
}
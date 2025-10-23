import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Pista } from "../pista/pista.entity"; // Importa la entidad Pista

export enum estado_instalacion {
  ACTIVA = "activa", 
  EN_MANTENIMIENTO = "en_mantenimiento",
  INACTIVA = "inactiva"
}
@Entity()
export class Instalacion {
  @PrimaryGeneratedColumn({type: "int"})
  instalacion_id: number;
  
  @Column()
  nombre: string;

  @Column()
  direccion: string;

  @Column()
  telefono: string;

  @Column()
  email: string;

  @Column({type: "int"})
  capacidad_max: number;

  @Column()
  descripcion: string;

  @Column()
  fecha_creacion: Date;

  @Column({
      type: "enum",
      enum: estado_instalacion,
      default: estado_instalacion.INACTIVA, // valor por defecto
    })
    estado: estado_instalacion;

  @Column()
  horario_apertura: Date;

  @Column()
  horario_cierre: Date;

  @ManyToOne(() => Pista, pista => pista.instalacion_id)
  pista: Pista;
}
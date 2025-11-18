import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
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

  @Column({type: "int"})
    pista_id: number; // clave foranea instalacion
  
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

  @Column({ type: "date", default: () => "CURRENT_DATE" })
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

  @OneToMany(() => Pista, (pista) => pista.instalacion)
  pista: Pista[];

}
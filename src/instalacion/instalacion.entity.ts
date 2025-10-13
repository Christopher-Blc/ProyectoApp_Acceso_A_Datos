import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Pista } from "src/pista/pista.entity"; // Importa la entidad Pista

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

  @Column()
  estado: string;//tendra que ser un enum

  @Column()
  horario_apertura: Date;

  @Column()
  horario_cierre: Date;

  @ManyToOne(() => Pista, pista => pista.instalacion_id)
  pista: Pista;
}
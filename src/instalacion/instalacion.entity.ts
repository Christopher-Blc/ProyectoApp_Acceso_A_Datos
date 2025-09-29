import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
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


}
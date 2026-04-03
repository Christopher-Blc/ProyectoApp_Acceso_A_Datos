import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity("membresia")
export class Membresia {
  @PrimaryGeneratedColumn({ name: "membresia_id" })
  membresia_id: number;

  @Column({ unique: true })
  rango: string; //tipo bronze es el as bajo osea rango 1 , plata rango 2 y oro rango 3

  @Column({ unique: true })
  tipo: string; // Ej: "Bronce", "Plata", "Oro"

  @Column({ 
    type: "decimal", 
    precision: 5, 
    scale: 2, 
    default: 0,
    transformer: {
        to: (value: number) => value,
        from: (value: string) => parseFloat(value)
    }
  })
  descuento: number; // Porcentaje de descuento (ej: 5.00 para 5%)

  @Column({ type: "int", default: 0 })
  reservas_requeridas: number; // Cuántas reservas necesita el user para este nivel

  @Column({ type: "text", nullable: true })
  beneficios: string; // Descripción breve de lo que incluye

  // Relación: Una membresía (ej: Oro) la tienen muchos usuarios
  @OneToMany(() => User, (u) => u.membresia)
  users: User[];
}
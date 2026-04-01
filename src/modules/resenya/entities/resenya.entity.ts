import { Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToOne, JoinColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Instalacion } from "src/modules/instalacion/entities/instalacion.entity";

@Entity()
export class Resenya {
  @PrimaryGeneratedColumn({name: "resenya_id", type: "int" })
  resenya_id: number;

  @Column({name: "instalacion_id", type: "int" }) 
  instalacion_id: number;

  @Column({name: "usuario_id", type: "int" }) // Clave FK hacia Usuario
  usuario_id: number;

  @Column()
  titulo: string;

  @Column()
  texto: string;

  @Column({type: "int"})
  calificacion: number;

  @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  fecha_comentario: Date;

  @Column()
  visible: boolean;

  @OneToOne(() => User, (u) => u.resenya)
  @JoinColumn({ name: "usuario_id" })
  user: User;

  @ManyToOne(() => Instalacion, (i) => i.instalacion_id)
  @JoinColumn({ name: "instalacion_id" })
  instalacion: Instalacion;
}




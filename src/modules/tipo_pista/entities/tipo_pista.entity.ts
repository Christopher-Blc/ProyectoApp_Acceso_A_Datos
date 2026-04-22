import { Entity, Column, PrimaryGeneratedColumn, OneToMany} from "typeorm";
import { Pista } from "../../pista/entities/pista.entity";


@Entity('tipos_pista')
export class TipoPista {
  @PrimaryGeneratedColumn()
  tipo_pista_id: number;

  @Column()
  nombre: string;

  @Column({ })
  imagen: string; // Aquí guardaremos algo como "pista-tenis.jpg"

  @OneToMany(() => Pista, (pista) => pista.tipo_pista)
  pistas: Pista[];
 
}



import { Entity, Column, PrimaryGeneratedColumn, OneToMany} from "typeorm";
import { Pista } from "src/modules/pista/entities/pista.entity";


@Entity('tipos_pista')
export class TipoPista {
  @PrimaryGeneratedColumn()
  tipo_pista_id: number;

  @Column()
  nombre: string;

  @OneToMany(() => Pista, (pista) => pista.tipo_pista)
  pistas: Pista[];
}



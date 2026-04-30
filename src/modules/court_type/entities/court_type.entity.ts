import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Court } from '../../court/entities/court.entity';

@Entity('tipos_pista')
export class CourtType {
  @PrimaryGeneratedColumn()
  tipo_pista_id: number;

  @Column()
  nombre: string;

  @Column({})
  imagen: string; // Aquí guardaremos algo como "pista-tenis.jpg"

  @OneToMany(() => Court, (court) => court.tipo_Court)
  pistas: Court[];
}



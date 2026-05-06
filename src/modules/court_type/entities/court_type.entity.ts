import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Court } from '../../court/entities/court.entity';

@Entity('tipos_Court')
export class CourtType {
  @PrimaryGeneratedColumn({ name: 'court_type_id' })
  court_type_id!: number;

  @Column()
  nombre!: string;

  @Column({})
  imagen!: string; // Aquí guardaremos algo como "Court-tenis.jpg"

  @OneToMany(() => Court, (court) => court.courtType)
  courts!: Court[];
}

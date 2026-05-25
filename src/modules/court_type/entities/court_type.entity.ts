import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Court } from '../../court/entities/court.entity';

@Entity('tipos_Court')
export class CourtType {
  @PrimaryGeneratedColumn({ name: 'court_type_id' })
  id!: number;

  @Column()
  name!: string;

  @OneToMany(() => Court, (court) => court.courtType)
  courts!: Court[];
}

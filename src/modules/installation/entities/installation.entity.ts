import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Court } from '../../court/entities/court.entity'; // Importa la entidad Court
import { Review } from '../../review/entities/review.entity';

export enum estado_instalacion {
  ACTIVE = 'activa',
  MAINTENANCE = 'en_mantenimiento',
  INACTIVE = 'inactiva',
}

export type InstallationStatus = estado_instalacion;
@Entity()
export class Installation {
  @PrimaryGeneratedColumn({ name: 'installation_id', type: 'int' })
  installation_id!: number;

  @Column({ type: 'varchar', length: 100 })
  nombre!: string;

  @Column({ type: 'varchar', length: 100 })
  address!: string;

  @Column({ type: 'varchar', length: 100 })
  phone!: string;

  @Column({ type: 'varchar', length: 100 })
  email!: string;

  @Column({ type: 'varchar', length: 100 })
  description?: string;

  @Column({
    type: 'date',
    default: () => 'CURRENT_DATE',
    name: 'creation_date',
  })
  creation_date!: Date;

  @Column({
    type: 'enum',
    enum: estado_instalacion,
    default: estado_instalacion.INACTIVE, // default value
  })
  status!: estado_instalacion;

  @Column({ type: 'int', nullable: true })
  max_capacity?: number;

  @Column({ type: 'time', nullable: true })
  opening_hours?: string;

  @Column({ type: 'time', nullable: true })
  closing_hours?: string;

  @OneToMany(() => Court, (c) => c.Installation)
  courts!: Court[];

  @OneToMany(() => Review, (r) => r.Installation)
  reviews!: Review[];
}

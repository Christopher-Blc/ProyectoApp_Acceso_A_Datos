import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Court } from '../../court/entities/court.entity'; // Importa la entidad Court
import { Review } from '../../review/entities/review.entity';

export enum InstallationStatus {
  ACTIVE = 'activa',
  MAINTENANCE = 'en_mantenimiento',
  INACTIVE = 'inactiva',
}
@Entity()
export class Installation {
  @PrimaryGeneratedColumn({ name: 'installation_id', type: 'int' })
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

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
  createdAt!: Date;

  @Column({
    type: 'enum',
    enum: InstallationStatus,
    default: InstallationStatus.INACTIVE, // default value
  })
  status!: InstallationStatus;

  @Column({ type: 'int', nullable: true })
  maxCapacity?: number;

  @Column({ type: 'time', nullable: true })
  openingHours?: string;

  @Column({ type: 'time', nullable: true })
  closingHours?: string;

  @OneToMany(() => Court, (c) => c.installation)
  courts!: Court[];

  @OneToMany(() => Review, (r) => r.installation)
  reviews!: Review[];
}

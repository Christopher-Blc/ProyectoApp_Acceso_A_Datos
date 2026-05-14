import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Court } from '../../court/entities/court.entity'; // Importa la entidad Court

export enum InstallationStatus {
  ACTIVE = 'activa',
  MAINTENANCE = 'en_mantenimiento',
  INACTIVE = 'inactiva',
}
@Entity()
export class Installation {
  @PrimaryGeneratedColumn({ name: 'installation_id', type: 'int' })
  id!: number;

  @Column({ name: 'name', type: 'varchar', length: 100 })
  name!: string;

  @Column({ name: 'address', type: 'varchar', length: 100 })
  address!: string;

  @Column({ name: 'phone', type: 'varchar', length: 100 })
  phone!: string;

  @Column({ name: 'email', type: 'varchar', length: 100 })
  email!: string;

  @Column({ name: 'description', type: 'varchar', length: 100, nullable: true })
  description?: string;

  @Column({
    type: 'date',
    default: () => 'CURRENT_DATE',
    name: 'created_at',
  })
  created_at!: Date;

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

}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Court } from '../../pista/entities/court.entity'; // Importa la entidad Pista

export enum estado_Installation {
  ACTIVA = 'activa',
  EN_MANTENIMIENTO = 'en_mantenimiento',
  INACTIVA = 'inactiva',
}
@Entity()
export class Installation {
  @PrimaryGeneratedColumn({ name: 'instalacion_id', type: 'int' })
  instalacion_id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 100 })
  direccion: string;

  @Column({ type: 'varchar', length: 100 })
  telefono: string;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  descripcion: string;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  fecha_creacion: Date;

  @Column({
    type: 'enum',
    enum: estado_Installation,
    default: estado_instalacion.INACTIVA, // valor por defecto
  })
  estado: estado_instalacion;

  @OneToMany(() => Court, (pi) => pi.instalacion)
  pistas: Court[];
}




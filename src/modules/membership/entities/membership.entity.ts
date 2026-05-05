import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('Membership')
export class Membership {
  @PrimaryGeneratedColumn({ name: 'membership_id' })
  membership_id!: number;

  @Column({ type: 'int', unique: true })
  level!: number; //tipo bronze es el mas bajo osea level 1, silver level 2, gold level 3

  @Column({ type: 'varchar', length: 100, unique: true })
  nombre!: string; // Ej: "Bronce", "Plata", "Oro"

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  discount!: number; // Percentage discount (e.g. 5.00 for 5%)

  @Column({ type: 'int', default: 0 })
  required_reservations!: number; // How many reservations needed for this level

  @Column({ type: 'text', nullable: true })
  benefits?: string; // Brief description of benefits

  // Relationship: One membership (e.g. Gold) can have many users
  @OneToMany(() => User, (u) => u.Membership)
  users: User[];
}



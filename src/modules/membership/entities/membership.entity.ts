import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('Membership')
export class Membership {
  @PrimaryGeneratedColumn({ name: 'membership_id' })
  id!: number;

  @Column({ name: 'level', type: 'int', unique: true })
  level!: number;

  @Column({ name: 'name', type: 'varchar', length: 100, unique: true })
  name!: string;

  @Column({
    name: 'discount',
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  discount!: number;

  @Column({ name: 'required_reservations', type: 'int', default: 0 })
  required_reservations!: number;

  @Column({ name: 'benefits', type: 'text', nullable: true })
  benefits?: string;

  // Relationship: One membership (e.g. Gold) can have many users
  @OneToMany(() => User, (u) => u.membership)
  users!: User[];
}

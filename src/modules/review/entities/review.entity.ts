import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Court } from '../../court/entities/court.entity';

@Unique(['user_id', 'court_id'])
@Entity()
export class Review {
  @PrimaryGeneratedColumn({ name: 'review_id', type: 'int' })
  id!: number;

  @Column({ name: 'user_id', type: 'int' })
  user_id!: number;

  @Column({ name: 'court_id', type: 'int' })
  court_id!: number;

  @Column({ name: 'title' })
  title!: string;

  @Column({ name: 'text', type: "longtext" })
  text!: string;

  @Column({ name: 'rating', type: 'int' })
  rating!: number;

  @Column({
    name: 'comment_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  comment_date!: Date;

  @Column({ name: 'is_visible', default: true })
  is_visible!: boolean;

  @Column({ name: 'admin_answer', nullable: true, type: "longtext" })
  admin_answer?: string;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at!: Date;

  @ManyToOne(() => User, (u) => u.reviews)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Court, (c) => c.reviews)
  @JoinColumn({ name: 'court_id' })
  court!: Court;
}

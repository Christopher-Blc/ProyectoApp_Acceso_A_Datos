import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Installation } from '../../installation/entities/installation.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn({ name: 'review_id', type: 'int' })
  id!: number;

  @Column({ name: 'installation_id', type: 'int' })
  installation_id!: number;

  @Column({ name: 'user_id', type: 'int' })
  user_id!: number;

  @Column({ name: 'title' })
  title!: string;

  @Column({ name: 'text' })
  text!: string;

  @Column({ name: 'rating', type: 'int' })
  rating!: number;

  @Column({ name: 'comment_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  comment_date!: Date;

  @Column({ name: 'is_visible', default: true })
  is_visible!: boolean;

  @OneToOne(() => User, (u) => u.review)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Installation, (i) => i.reviews)
  @JoinColumn({ name: 'installation_id' })
  installation!: Installation;
}

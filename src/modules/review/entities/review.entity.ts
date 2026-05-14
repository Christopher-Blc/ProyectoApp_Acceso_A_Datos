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
import { Court } from 'src/modules/court/entities/court.entity';

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

  @ManyToOne(() => Court, (c) => c.reviews)
  @JoinColumn({ name: 'court_id' })
  court!: Court;
}

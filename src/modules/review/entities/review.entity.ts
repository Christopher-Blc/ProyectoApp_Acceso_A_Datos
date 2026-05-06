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
  installationId!: number;

  @Column({ name: 'user_id', type: 'int' }) // Foreign key to User
  userId!: number;

  @Column()
  title!: string;

  @Column()
  text!: string;

  @Column({ type: 'int' })
  rating!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  commentDate!: Date;

  @Column({ default: true })
  isVisible!: boolean;

  @OneToOne(() => User, (u) => u.review)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Installation, (i) => i.reviews)
  @JoinColumn({ name: 'installation_id' })
  installation!: Installation;
}

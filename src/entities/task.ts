import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne((type) => User, (user) => user.tasks)
  user!: User;

  @Column({ nullable: false, unique: false })
  type!: string;

  @Column({ type: 'timestamptz', nullable: true })
  completedAt!: string | null;

  @Column({ nullable: false })
  cost!: number;
}

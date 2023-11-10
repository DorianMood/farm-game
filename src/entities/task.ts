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

  @Column({ nullable: true })
  completedAt!: Date | null;

  @Column({ nullable: false })
  cost!: number;
}

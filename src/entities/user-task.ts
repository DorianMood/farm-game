import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';
import { Task } from './task';

@Entity()
export class UserTask {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne((type) => User, (user) => user.tasks)
  user!: User;

  @ManyToOne((type) => Task, (task) => task.userTask)
  task!: Task;

  @Column({ type: 'timestamptz', nullable: true })
  completedAt!: string | null;
}

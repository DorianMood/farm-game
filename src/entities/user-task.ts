import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './user';
import { Task } from './task';

@Entity()
export class UserTask {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne((type) => User, (user) => user.tasks, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user!: User;

  @ManyToOne((type) => Task, (task) => task.userTask, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  task!: Task;

  @Column({ type: 'timestamptz', nullable: true })
  completedAt!: string | null;
}

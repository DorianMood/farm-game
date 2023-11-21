import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './user';
import { Task } from './task';

@Entity()
export class UserTask {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.tasks, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user!: User;

  @ManyToOne(() => Task, (task) => task.userTask, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  task!: Task;

  @Column({ type: 'timestamptz', nullable: true })
  completedAt!: string | null;
}

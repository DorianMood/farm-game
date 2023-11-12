import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserTask } from './user-task';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToMany((type) => UserTask, (userTask) => userTask.task)
  userTask!: UserTask[];

  @Column({ nullable: false, unique: false })
  type!: string;

  @Column({ nullable: false })
  cost!: number;
}

import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question';
import { Task } from './task';

@Entity()
export class Survey {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToMany((type) => Question, (question) => question.survey)
  questions!: Question[];

  @ManyToOne((type) => Task)
  task!: Task;
}

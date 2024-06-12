import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Question } from "./question";
import { Task } from "./task";

@Entity()
export class Survey {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @OneToMany(() => Question, (question) => question.survey, { cascade: true })
  questions!: Question[];

  @ManyToOne(() => Task)
  task!: Task;
}

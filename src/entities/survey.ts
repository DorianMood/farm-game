import { Entity, ManyToOne, OneToMany } from "typeorm";

import { Question } from "./question";
import { Task } from "./task";
import { Id } from "./helpers";

@Entity()
export class Survey extends Id {
  @OneToMany(() => Question, (question) => question.survey, {
    cascade: true,
  })
  questions!: Question[];

  @ManyToOne(() => Task, { onDelete: "CASCADE" })
  task!: Task;
}

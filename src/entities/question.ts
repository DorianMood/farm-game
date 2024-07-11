import { Column, Entity, ManyToOne } from "typeorm";

import { Survey } from "./survey";
import { Id } from "./helpers";

@Entity()
export class Question extends Id {
  @ManyToOne(() => Survey, (survey) => survey.questions)
  survey!: Survey;

  @Column({ nullable: false })
  question!: string;

  @Column({ nullable: false })
  answer!: string;
}

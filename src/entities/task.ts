import { Column, Entity, OneToMany } from "typeorm";

import { UserTask } from "./user-task";
import { Id } from "./helpers";

export enum TaskEnum {
  Plant = "Plant",
  FinanceGenius = "FinanceGenius",
  CustomGame = "CustomGame",
}

@Entity()
export class Task extends Id {
  @OneToMany(() => UserTask, (userTask) => userTask.task, {
    cascade: true,
  })
  userTask!: UserTask[];

  @Column({ nullable: false, unique: false })
  type!: string;

  @Column({ nullable: false })
  cost!: number;
}

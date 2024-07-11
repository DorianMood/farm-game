import { Column, Entity, ManyToOne } from "typeorm";

import { User } from "./user";
import { Task } from "./task";
import { Id } from "./helpers";

@Entity()
export class UserTask extends Id {
  @ManyToOne(() => User, (user) => user.tasks)
  user!: User;

  @ManyToOne(() => Task, (task) => task.userTask)
  task!: Task;

  @Column({ type: "timestamptz", nullable: true })
  completedAt!: string | null;
}

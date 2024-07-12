import { Column, Entity, ManyToOne } from "typeorm";

import { User } from "./user";
import { Task } from "./task";
import { Id } from "./helpers";

@Entity()
export class UserTask extends Id {
  @ManyToOne(() => User, (user) => user.tasks, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  user!: User;

  @ManyToOne(() => Task, (task) => task.userTask, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  task!: Task;

  @Column({ type: "timestamptz", nullable: true })
  completedAt!: string | null;
}

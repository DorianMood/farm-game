import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { User } from "./user";
import { Id } from "./helpers";
import { Animal } from "./animal";

@Entity()
export class Barn extends Id {
  @Column({ nullable: false })
  index!: number;

  @ManyToOne(() => User, (user) => user.barns, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  user!: User;

  @Column({ type: "timestamptz", nullable: true })
  startedAt!: string | null;

  @ManyToOne(() => Animal, (animal) => animal.id, {
    nullable: true,
  })
  @JoinColumn()
  animal!: Animal | null;
}

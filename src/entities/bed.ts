import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { User } from "./user";
import { Id } from "./helpers";
import { Seed } from "./seed";

@Entity()
export class Bed extends Id {
  @Column({ nullable: false })
  index!: number;

  @ManyToOne(() => User, (user) => user.beds, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  user!: User;

  @Column({ type: "timestamptz", nullable: true })
  plantedAt!: string | null;

  @ManyToOne(() => Seed, (seed) => seed.id, {
    nullable: true,
  })
  @JoinColumn()
  crop!: Seed | null;
}

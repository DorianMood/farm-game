import { Column, Entity, ManyToOne } from "typeorm";

import { CropEnum } from "../common/enums";

import { User } from "./user";
import { Id } from "./helpers";

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

  @Column({
    type: "enum",
    enum: CropEnum,
    nullable: true,
    default: null,
  })
  crop!: CropEnum | null;
}

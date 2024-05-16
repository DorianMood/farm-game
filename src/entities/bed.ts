import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { User } from "./user";

export enum CropEnum {
  Carrot = "Carrot",
  Potato = "Potato",
  Beet = "Beet",
  Wheat = "Wheat",
  Flower = "Flower",
}

@Entity()
export class Bed {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

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
  crop!: string | null;
}

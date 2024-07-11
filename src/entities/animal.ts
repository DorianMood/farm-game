import { Column, Entity } from "typeorm";

import { Id } from "./helpers";
import { PetEnum } from "../common/enums";

@Entity()
export class Animal extends Id {
  @Column({
    type: "enum",
    enum: PetEnum,
    unique: true,
  })
  pet!: PetEnum;

  @Column({ nullable: false })
  harvestTimeout!: number;

  @Column({ nullable: false })
  name!: string;

  @Column({ nullable: false, type: "text" })
  description!: string;
}

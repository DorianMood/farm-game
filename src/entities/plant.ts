import { Column, Entity } from "typeorm";

import { CropEnum } from "../common/enums";
import { Id } from "./helpers";

@Entity()
export class Plant extends Id {
  @Column({
    type: "enum",
    enum: CropEnum,
    unique: true,
  })
  crop!: CropEnum;

  @Column({ nullable: false })
  harvestTimeout!: number;

  @Column({ nullable: false })
  name!: string;

  @Column({ nullable: false, type: "text" })
  description!: string;
}

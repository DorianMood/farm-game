import { Entity, JoinColumn, OneToOne } from "typeorm";

import { Id } from "./helpers";
import { Plant } from "./plant";

@Entity()
export class Seed extends Id {
  @OneToOne(() => Plant)
  @JoinColumn()
  plant!: Plant;
}

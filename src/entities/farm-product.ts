import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { IdDates } from "./helpers";
import { Animal } from "./animal";
import { Plant } from "./plant";
import { Seed } from "./seed";

@Entity({ name: "farm_product" })
export class FarmProduct extends IdDates {
  @Column({ nullable: false })
  price!: number;

  @Column({ nullable: false })
  sellMultiplier!: number;

  @OneToOne(() => Animal, { cascade: true, nullable: true })
  @JoinColumn()
  animal?: Animal;

  @OneToOne(() => Plant, { cascade: true, nullable: true })
  @JoinColumn()
  plant?: Plant;

  @OneToOne(() => Seed, { cascade: true, nullable: true })
  @JoinColumn()
  seed?: Seed;
}

import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { Id } from "./helpers";
import { SeedEnum } from "../common/enums";
import { FarmProduct } from "./farm-product";

@Entity()
export class Seed extends Id {
  @OneToOne(() => FarmProduct, (farmProduct) => farmProduct.seed, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  farmProduct!: FarmProduct;

  @Column({
    type: "enum",
    enum: SeedEnum,
    unique: true,
  })
  type!: SeedEnum;

  @Column({ nullable: false })
  harvestTimeout!: number;
}

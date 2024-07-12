import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { SeedProductEnum } from "../common/enums";
import { Id } from "./helpers";
import { FarmProduct } from "./farm-product";

@Entity()
export class SeedProduct extends Id {
  @OneToOne(() => FarmProduct, (farmProduct) => farmProduct.seedProduct, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  farmProduct!: FarmProduct;

  @Column({
    type: "enum",
    enum: SeedProductEnum,
    unique: true,
  })
  type!: SeedProductEnum;
}

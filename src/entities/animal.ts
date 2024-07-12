import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { Id } from "./helpers";
import { AnimalEnum } from "../common/enums";
import { FarmProduct } from "./farm-product";

@Entity()
export class Animal extends Id {
  @OneToOne(() => FarmProduct, (farmProduct) => farmProduct.animal, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  farmProduct!: FarmProduct;

  @Column({
    type: "enum",
    enum: AnimalEnum,
    unique: true,
  })
  type!: AnimalEnum;

  @Column({ nullable: false })
  harvestTimeout!: number;
}

import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { AnimalProductEnum } from "../common/enums";
import { Id } from "./helpers";
import { FarmProduct } from "./farm-product";

@Entity()
export class AnimalProduct extends Id {
  @OneToOne(() => FarmProduct, (farmProduct) => farmProduct.animalProduct, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  farmProduct!: FarmProduct;

  @Column({
    type: "enum",
    enum: AnimalProductEnum,
    unique: true,
  })
  type!: AnimalProductEnum;
}

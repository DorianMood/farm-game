import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";

import { Id } from "./helpers";
import { AnimalEnum } from "../common/enums";
import { InventoryItem } from "./inventory-item";
import { AnimalProduct } from "./animal-product";

@Entity()
export class Animal extends Id {
  @OneToOne(() => InventoryItem, (inventoryItem) => inventoryItem.animal, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  inventoryItem!: InventoryItem;

  @Column({
    type: "enum",
    enum: AnimalEnum,
    unique: true,
  })
  type!: AnimalEnum;

  @Column({ nullable: false })
  harvestTimeout!: number;

  @OneToMany(() => AnimalProduct, (animalProduct) => animalProduct.animal)
  animalProducts!: AnimalProduct[];
}

import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { AnimalProductEnum } from "../common/enums";
import { Id } from "./helpers";
import { InventoryItem } from "./inventory-item";

@Entity()
export class AnimalProduct extends Id {
  @OneToOne(
    () => InventoryItem,
    (inventoryItem) => inventoryItem.animalProduct,
    {
      onDelete: "CASCADE",
    },
  )
  @JoinColumn()
  inventoryItem!: InventoryItem;

  @Column({
    type: "enum",
    enum: AnimalProductEnum,
    unique: true,
  })
  type!: AnimalProductEnum;
}

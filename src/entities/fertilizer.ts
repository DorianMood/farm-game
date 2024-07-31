import { Entity, JoinColumn, OneToOne } from "typeorm";

import { Id } from "./helpers";
import { InventoryItem } from "./inventory-item";

@Entity()
export class Fertilizer extends Id {
  @OneToOne(() => InventoryItem, (inventoryItem) => inventoryItem.animal, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  inventoryItem!: InventoryItem;
}

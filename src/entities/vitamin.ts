import { Entity, JoinColumn, OneToOne } from "typeorm";

import { Id } from "./helpers";
import { InventoryItem } from "./inventory-item";

@Entity()
export class Vitamin extends Id {
  @OneToOne(() => InventoryItem, (inventoryItem) => inventoryItem.vitamin, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  inventoryItem!: InventoryItem;
}

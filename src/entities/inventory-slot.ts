import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { Id } from "./helpers";
import { Inventory } from "./inventory";
import { InventoryItem } from "./inventory-item";

@Entity()
export class InventorySlot extends Id {
  @ManyToOne(() => Inventory, (inventory) => inventory.items, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  inventory!: Inventory;

  @Column()
  amount!: number;

  @ManyToOne(() => InventoryItem, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn()
  inventoryItem!: InventoryItem;
}

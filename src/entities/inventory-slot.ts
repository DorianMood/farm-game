import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { Id } from "./helpers";
import { Inventory } from "./inventory";
import { FarmProduct } from "./farm-product";

@Entity()
export class InventorySlot extends Id {
  @ManyToOne(() => Inventory, (inventory) => inventory.items, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  inventory!: Inventory;

  @Column()
  amount!: number;

  @ManyToOne(() => FarmProduct, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn()
  farmProduct!: FarmProduct;
}

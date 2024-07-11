import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { Id } from "./helpers";
import { Inventory } from "./inventory";
import { FarmProduct } from "./farm-product";

@Entity()
export class InventoryItem extends Id {
  @ManyToOne(() => Inventory, (inventory) => inventory.items)
  inventory!: Inventory;

  @Column()
  amount!: number;

  @ManyToOne(() => FarmProduct)
  @JoinColumn()
  farmProduct!: FarmProduct;
}

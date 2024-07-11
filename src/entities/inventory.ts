import { Entity, ManyToOne, OneToMany } from "typeorm";

import { User } from "./user";
import { IdDates } from "./helpers";
import { InventoryItem } from "./inventory-item";

@Entity()
export class Inventory extends IdDates {
  @ManyToOne(() => User, (user) => user.inventoryList)
  user!: User;

  @OneToMany(() => InventoryItem, (item) => item.inventory, { cascade: true })
  items!: InventoryItem[];
}

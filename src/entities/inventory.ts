import { Entity, OneToMany, OneToOne } from "typeorm";

import { User } from "./user";
import { IdDates } from "./helpers";
import { InventorySlot } from "./inventory-slot";

@Entity()
export class Inventory extends IdDates {
  @OneToOne(() => User, (user) => user.inventoryList, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  user!: User;

  @OneToMany(() => InventorySlot, (item) => item.inventory, {
    cascade: true,
  })
  items!: InventorySlot[];
}

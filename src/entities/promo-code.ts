import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { Id } from "./helpers";
import { InventoryItem } from "./inventory-item";

@Entity()
export class PromoCode extends Id {
  @OneToOne(() => InventoryItem, (inventoryItem) => inventoryItem.promoCode, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  inventoryItem!: InventoryItem;

  @Column({
    type: "text",
  })
  link!: string;
}

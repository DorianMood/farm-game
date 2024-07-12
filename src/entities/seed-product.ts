import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { SeedProductEnum } from "../common/enums";
import { Id } from "./helpers";
import { InventoryItem } from "./inventory-item";

@Entity()
export class SeedProduct extends Id {
  @OneToOne(() => InventoryItem, (inventoryItem) => inventoryItem.seedProduct, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  inventoryItem!: InventoryItem;

  @Column({
    type: "enum",
    enum: SeedProductEnum,
    unique: true,
  })
  type!: SeedProductEnum;
}

import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { Id } from "./helpers";
import { SeedEnum } from "../common/enums";
import { InventoryItem } from "./inventory-item";

@Entity()
export class Seed extends Id {
  @OneToOne(() => InventoryItem, (inventoryItem) => inventoryItem.seed, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  inventoryItem!: InventoryItem;

  @Column({
    type: "enum",
    enum: SeedEnum,
    unique: true,
  })
  type!: SeedEnum;

  @Column({ nullable: false })
  harvestTimeout!: number;
}

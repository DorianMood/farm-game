import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { Id } from "./helpers";
import { AnimalEnum } from "../common/enums";
import { InventoryItem } from "./inventory-item";

@Entity()
export class Animal extends Id {
  @OneToOne(() => InventoryItem, (inventoryItem) => inventoryItem.animal, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  inventoryItem!: InventoryItem;

  @Column({
    type: "enum",
    enum: AnimalEnum,
    unique: true,
  })
  type!: AnimalEnum;

  @Column({ nullable: false })
  harvestTimeout!: number;
}

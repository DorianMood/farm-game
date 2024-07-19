import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

import { SeedProductEnum } from "../common/enums";
import { Id } from "./helpers";
import { InventoryItem } from "./inventory-item";
import { Seed } from "./seed";

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

  @ManyToOne(() => Seed, (seed) => seed.seedProducts, { cascade: true })
  @JoinColumn()
  seed!: Seed;
}

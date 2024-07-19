import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

import { AnimalProductEnum } from "../common/enums";
import { Id } from "./helpers";
import { InventoryItem } from "./inventory-item";
import { Animal } from "./animal";

@Entity()
export class AnimalProduct extends Id {
  @OneToOne(
    () => InventoryItem,
    (inventoryItem) => inventoryItem.animalProduct,
    {
      onDelete: "CASCADE",
    },
  )
  @JoinColumn()
  inventoryItem!: InventoryItem;

  @Column({
    type: "enum",
    enum: AnimalProductEnum,
    unique: true,
  })
  type!: AnimalProductEnum;

  @ManyToOne(() => Animal, (animal) => animal.animalProducts, { cascade: true })
  @JoinColumn()
  animal!: Animal;
}

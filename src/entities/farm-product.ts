import { Column, Entity, OneToOne } from "typeorm";

import { IdDates } from "./helpers";
import { Animal } from "./animal";
import { Seed } from "./seed";
import { SeedProduct } from "./seed-product";
import { AnimalProduct } from "./animal-product";
import { InventoryItemCategoryEnum } from "../common/enums";

@Entity({ name: "farm_product" })
export class FarmProduct extends IdDates {
  @Column({ nullable: false })
  name!: string;

  @Column({ nullable: false, type: "text" })
  description!: string;

  @Column({ nullable: false })
  price!: number;

  @Column({ nullable: false })
  sellMultiplier!: number;

  @Column({
    type: "enum",
    enum: InventoryItemCategoryEnum,
    nullable: true,
    default: null,
  })
  category!: InventoryItemCategoryEnum | null;

  @OneToOne(() => Animal, (animal) => animal.farmProduct, {
    nullable: true,
    cascade: true,
  })
  animal?: Animal;

  @OneToOne(() => Seed, (seed) => seed.farmProduct, {
    nullable: true,
    cascade: true,
  })
  seed?: Seed;

  @OneToOne(() => AnimalProduct, (animalProduct) => animalProduct.farmProduct, {
    nullable: true,
    cascade: true,
  })
  animalProduct?: AnimalProduct;

  @OneToOne(() => SeedProduct, (seedProduct) => seedProduct.farmProduct, {
    nullable: true,
    cascade: true,
  })
  seedProduct?: SeedProduct;
}

import { Column, Entity, OneToOne } from "typeorm";

import { InventoryItemCategoryEnum } from "../common/enums";

import { IdDates } from "./helpers";
import { Animal } from "./animal";
import { Seed } from "./seed";
import { AnimalProduct } from "./animal-product";
import { SeedProduct } from "./seed-product";
import { PromoCode } from "./promo-code";
import { Fertilizer } from "./fertilizer";

@Entity()
export class InventoryItem extends IdDates {
  @Column({ nullable: false })
  name!: string;

  @Column({ nullable: false, type: "text" })
  description!: string;

  @Column({ nullable: false })
  price!: number;

  @Column({ nullable: false, type: "float", default: 1 })
  sellMultiplier!: number;

  @Column({
    type: "enum",
    enum: InventoryItemCategoryEnum,
    nullable: true,
    default: null,
  })
  category!: InventoryItemCategoryEnum | null;

  @OneToOne(() => Animal, (animal) => animal.inventoryItem, {
    nullable: true,
    cascade: true,
    eager: true,
  })
  animal?: Animal;

  @OneToOne(() => Seed, (seed) => seed.inventoryItem, {
    nullable: true,
    cascade: true,
    eager: true,
  })
  seed?: Seed;

  @OneToOne(
    () => AnimalProduct,
    (animalProduct) => animalProduct.inventoryItem,
    {
      nullable: true,
      cascade: true,
      eager: true,
    },
  )
  animalProduct?: AnimalProduct;

  @OneToOne(() => SeedProduct, (seedProduct) => seedProduct.inventoryItem, {
    nullable: true,
    cascade: true,
    eager: true,
  })
  seedProduct?: SeedProduct;

  @OneToOne(() => PromoCode, (promoCode) => promoCode.inventoryItem, {
    nullable: true,
    cascade: true,
    eager: true,
  })
  promoCode?: PromoCode;

  @OneToOne(() => Fertilizer, (fertilizer) => fertilizer.inventoryItem, {
    nullable: true,
    cascade: true,
    eager: true,
  })
  fertilizer?: Fertilizer;
}

import { MigrationInterface, QueryRunner } from "typeorm";

import { Animal } from "../entities/animal";
import { InventoryItem } from "../entities/inventory-item";
import { Seed } from "../entities/seed";
import {
  AnimalEnum,
  AnimalProductEnum,
  InventoryItemCategoryEnum,
  SeedEnum,
  SeedProductEnum,
} from "../common/enums";
import { SeedProduct } from "../entities/seed-product";
import { AnimalProduct } from "../entities/animal-product";
import { Fertilizer } from "../entities/fertilizer";

/**
 * INFO:
 * This a data migration, it will be executed when the database is first created.
 * It doesnt change the database schema but only fill the database with data.
 **/

// INFO: this migration creates all possible animal, plants and seeds

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

const DEFAULT_SELL_MULTIPLIER = 0.8;

const data = {
  // WARNING: order metters
  animals: [
    {
      harvestTimeout: 6 * HOUR,
      type: AnimalEnum.HenAnimal,
      name: "Курица",
      description:
        "Эта маленькая и трудолюбивая курочка станет отличным дополнением вашей фермы. С её помощью вы сможете получать свежие яйца каждый день, а также заботиться о чистоте вашего двора, что поможет держать насекомых в стороне. Курочка любит клевать зерно и уютно устроиться в своём курятнике. Питомец не только приносит пользу, но и радует глаз своим милым видом.",
      price: 100,
      sellMultiplier: DEFAULT_SELL_MULTIPLIER,
    },
    {
      harvestTimeout: 12 * HOUR,
      type: AnimalEnum.SheepAnimal,
      name: "Овца",
      description:
        "Эта пушистая овечка станет настоящим украшением вашей фермы. Овца дарит не только милый внешний вид, но и полезные продукты: шерсть, которую можно стричь для изготовления одежды и других товаров. Овцы любят пастись на зелёных лугах и отдыхают в тени деревьев. Они также являются дружелюбными и спокойными существами, которые отлично чувствуют себя в компании других животных.",
      price: 200,
      sellMultiplier: DEFAULT_SELL_MULTIPLIER,
    },
    {
      harvestTimeout: 18 * HOUR,
      type: AnimalEnum.CowAnimal,
      name: "Корова",
      description:
        "Эта величественная корова станет основой вашего молочного хозяйства. Корова ежедневно будет радовать вас свежим молоком, которое можно использовать для приготовления различных продуктов, таких как сыр и йогурт. Она спокойна и дружелюбна, прекрасно чувствует себя на зелёных пастбищах и в уютном коровнике.",
      price: 300,
      sellMultiplier: DEFAULT_SELL_MULTIPLIER,
    },
    {
      harvestTimeout: 24 * HOUR,
      type: AnimalEnum.PigAnimal,
      name: "Свинья",
      description:
        "Свинья — это не только источник мяса и сала, но и отличный друг для фермера. Они очень дружелюбные и общительные животные, которые любят внимание и заботу.",
      price: 400,
      sellMultiplier: DEFAULT_SELL_MULTIPLIER,
    },
  ],
  // WARNING: order metters
  animalProducts: [
    {
      type: AnimalProductEnum.Hen,
      name: "Куриные яйца",
      description:
        "Для получения куриных яиц необходимо содержать кур в курятнике. Куры начинают нести яйца примерно в возрасте шести месяцев. В день одна курица может снести одно или два яйца. Куриные яйца можно продавать на рынке или использовать для собственного потребления. Это ценный продукт, который может принести хороший доход фермеру.",
      price: 10,
      sellMultiplier: DEFAULT_SELL_MULTIPLIER,
    },
    {
      type: AnimalProductEnum.Sheep,
      name: "Овечья шерсть",
      description:
        "Овечья шерсть — это материал, который получают от овец. Овцы — это домашние животные, которые обитают на фермах и являются одними из самых популярных источников шерсти. Шерсть используется для производства различных изделий, таких как одежда, ковры, пледы и многое другое.",
      price: 20,
      sellMultiplier: DEFAULT_SELL_MULTIPLIER,
    },
    {
      type: AnimalProductEnum.Cow,
      name: "Коровье молоко",
      description:
        "Для получения коровьего молока необходимо доить корову. Дойка обычно проводится утром и вечером. После дойки молоко обрабатывается и готовится к использованию. Коровье молоко можно продавать на рынке или использовать для собственного потребления. Это ценный продукт, который может принести хороший доход фермеру.",
      price: 30,
      sellMultiplier: DEFAULT_SELL_MULTIPLIER,
    },
    {
      type: AnimalProductEnum.Pig,
      name: "Свинина",
      description:
        "Для получения свинины необходимо вырастить свинью до определённого возраста и веса, после чего её забивают. Затем мясо обрабатывается и готовится к употреблению. Свинину можно продавать на рынке или использовать для собственного потребления. Это ценный продукт, который может принести хороший доход фермеру.",
      price: 40,
      sellMultiplier: DEFAULT_SELL_MULTIPLIER,
    },
  ],
  // WARNING: order metters
  seeds: [
    {
      harvestTimeout: 5 * MINUTE,
      type: SeedEnum.CarrotSeed,
      name: "Семена моркови",
      description:
        "Морковь — это овощ, который выращивается на фермах и является одним из самых популярных источников витаминов и минералов. Семена моркови используются для посадки новых растений.",
      price: 10,
      sellMultiplier: DEFAULT_SELL_MULTIPLIER,
    },
    {
      harvestTimeout: 10 * MINUTE,
      type: SeedEnum.BeetSeed,
      name: "Семена свеклы",
      description:
        "Свекла — это овощ, который выращивается на фермах и является одним из самых популярных источников витаминов и минералов. Семена свеклы используются для посадки новых растений.",
      price: 20,
      sellMultiplier: DEFAULT_SELL_MULTIPLIER,
    },
    {
      harvestTimeout: 15 * MINUTE,
      type: SeedEnum.PotatoSeed,
      name: "Картофель под посадку",
      description:
        "Клубни картофеля являются важным пищевым продуктом. Плоды ядовиты в связи с содержанием в них соланина. Картофель под посадку используется для выращивания новых растений.",
      price: 30,
      sellMultiplier: DEFAULT_SELL_MULTIPLIER,
    },
    {
      harvestTimeout: 20 * MINUTE,
      type: SeedEnum.WheatSeed,
      name: "Семена пшеницы",
      description:
        "Получаемая из зёрен пшеницы мука используется при выпекании хлеба, изготовлении макаронных и кондитерских изделий. Семена пшеницы используются для посадки новых растений.",
      price: 40,
      sellMultiplier: DEFAULT_SELL_MULTIPLIER,
    },
    {
      harvestTimeout: 25 * MINUTE,
      type: SeedEnum.FlowerSeed,
      name: "Луковицы цветов",
      description:
        "Растения выращивают для украшения парков, скверов, садов, различных помещений, для получения цветов на срезку. Заниматься цветоводством люди начали в глубокой древности. Луковицы цветов используются для посадки новых растений.",
      price: 50,
      sellMultiplier: DEFAULT_SELL_MULTIPLIER,
    },
  ],
  // WARNING: order metters
  seedProducts: [
    {
      type: SeedProductEnum.Carrot,
      name: "Морковь",
      description:
        "Морковь — это овощ, который выращивается на фермах, она используется для приготовления различных блюд, таких как салаты, супы и многое другое. Для получения моркови необходимо посадить семена моркови.",
      price: 12,
      sellMultiplier: 1,
    },
    {
      type: SeedProductEnum.Beet,
      name: "Свекла",
      description:
        "Сахарная свекла в Российской Федерации является основным источником получения одного из ценнейших продуктов питания – сахара. Для получения свеклы необходимо посадить семена свеклы.",
      price: 24,
      sellMultiplier: 1,
    },
    {
      type: SeedProductEnum.Potato,
      name: "Картофель",
      description:
        "Картофель — это овощ, который выращивается на фермах и является одним из самых популярных источников углеводов. Картофель используется для приготовления различных блюд, таких как картофельное пюре, жареный картофель и многое другое. Для получения картофеля необходимо посадить клубни картофеля.",
      price: 36,
      sellMultiplier: 1,
    },
    {
      type: SeedProductEnum.Wheat,
      name: "Пшеница",
      description:
        "Пшеница — это злаковое растение, которое выращивается на фермах и является одним из самых популярных источников углеводов. Пшеница используется для производства хлеба, макаронных изделий и других продуктов питания. Для получения пшеницы необходимо посадить семена пшеницы. ",
      price: 48,
      sellMultiplier: 1,
    },
    {
      type: SeedProductEnum.Flower,
      name: "Цветы",
      description:
        "Цветы — это растения, которые выращиваются на фермах и являются одними из самых популярных декоративных растений. Для получения цветов необходимо посадить луковицы или семена цветов.",
      price: 60,
      sellMultiplier: 1,
    },
  ],
  fertilizers: [
    {
      name: "Удобрение",
      description:
        "Удобрения используются для ускорения созревания растений. Купите и примените его для того чтобы удобрение возымело эффект.",
      price: 200,
      sellMultiplier: 1,
    },
  ],
};

export class Sh2000000000001 implements MigrationInterface {
  name = "Sh2000000000001";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const inventoryItemRepo = queryRunner.manager.getRepository(InventoryItem);

    // Animals
    const animals: InventoryItem[] = [];

    for (const item of data.animals) {
      const animal = new Animal();
      animal.harvestTimeout = item.harvestTimeout;
      animal.type = item.type;

      const inventoryItem = new InventoryItem();
      inventoryItem.animal = animal;
      inventoryItem.name = item.name;
      inventoryItem.description = item.description;
      inventoryItem.price = item.price;
      inventoryItem.sellMultiplier = item.sellMultiplier;
      inventoryItem.category = InventoryItemCategoryEnum.Animal;
      animals.push(inventoryItem);
    }

    await inventoryItemRepo.save(animals);

    // Animal products
    const animalProducts: InventoryItem[] = [];

    for (let i = 0; i < data.animalProducts.length; i++) {
      const animal = animals[i];
      const item = data.animalProducts[i];

      const animalProduct = new AnimalProduct();
      animalProduct.type = item.type;
      animalProduct.animal = animal.animal!;

      const inventoryItem = new InventoryItem();
      inventoryItem.name = item.name;
      inventoryItem.description = item.description;
      inventoryItem.price = item.price;
      inventoryItem.animalProduct = animalProduct;
      inventoryItem.sellMultiplier = item.sellMultiplier;
      inventoryItem.category = InventoryItemCategoryEnum.AnimalProduct;
      animalProducts.push(inventoryItem);
    }

    await inventoryItemRepo.save(animalProducts);

    // Seeds
    const seeds: InventoryItem[] = [];

    for (const item of data.seeds) {
      const seed = new Seed();
      seed.harvestTimeout = item.harvestTimeout;
      seed.type = item.type;
      const inventoryItem = new InventoryItem();
      inventoryItem.name = item.name;
      inventoryItem.description = item.description;
      inventoryItem.price = item.price;
      inventoryItem.seed = seed;
      inventoryItem.sellMultiplier = item.sellMultiplier;
      inventoryItem.category = InventoryItemCategoryEnum.Seed;
      seeds.push(inventoryItem);
    }

    await inventoryItemRepo.save(seeds);

    // Seed products
    const seedProducts: InventoryItem[] = [];

    for (let i = 0; i < data.seedProducts.length; i++) {
      const seed = seeds[i];
      const item = data.seedProducts[i];

      const seedProduct = new SeedProduct();
      seedProduct.type = item.type;
      seedProduct.seed = seed.seed!;

      const inventoryItem = new InventoryItem();
      inventoryItem.name = item.name;
      inventoryItem.description = item.description;
      inventoryItem.price = item.price;
      inventoryItem.seedProduct = seedProduct;
      inventoryItem.sellMultiplier = item.sellMultiplier;
      inventoryItem.category = InventoryItemCategoryEnum.SeedProduct;
      seedProducts.push(inventoryItem);
    }

    await inventoryItemRepo.save(seedProducts);

    // Fertilizers
    const fertilizers: InventoryItem[] = [];

    for (let i = 0; i < data.fertilizers.length; i++) {
      const item = data.fertilizers[i];

      const fertilizer = new Fertilizer();

      const inventoryItem = new InventoryItem();
      inventoryItem.name = item.name;
      inventoryItem.description = item.description;
      inventoryItem.price = item.price;
      inventoryItem.fertilizer = fertilizer;
      inventoryItem.sellMultiplier = item.sellMultiplier;
      inventoryItem.category = InventoryItemCategoryEnum.Fertilizer;
      fertilizers.push(inventoryItem);
    }

    await inventoryItemRepo.save(fertilizers);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const inventoryItemRepo = queryRunner.manager.getRepository(InventoryItem);
    await inventoryItemRepo.delete({});
  }
}

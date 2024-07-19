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
        "В зависимости от породы, куры имеют различный вес, примерно 0,8 – 5 кг, а также различаются по окраске пера, цвету яиц, размеру и некоторым внешним признакам (характерным для декоративных пород). Петухи обычно крупнее самок, у них более яркое оперение и длинный хвост. С возрастом на ногах у петуха образуются шпоры – костные выросты. Куры и петухи имеют бородку и гребень, которые выполняют функцию терморегулятора и обеспечивают нормальный приток крови к коже. Гребень петуха гораздо больше, чем у кур, у цыплят он малозаметен. Формы гребня могут быть листовидными с зубцами по краю, стручковидными и др. Несмотря на то, что у кур есть крылья, они неспособны к длительному и высокому полету.",
      price: 100,
      sellMultiplier: DEFAULT_SELL_MULTIPLIER,
    },
    {
      harvestTimeout: 12 * HOUR,
      type: AnimalEnum.SheepAnimal,
      name: "Овца",
      description:
        "Современная овца очень давно одомашнена человеком, который нуждался в шерсти и съедобном мясе. Это животное — млекопитающее, оно относится к роду баранов из обширного семейства полорогих. Овечья шерсть и сейчас имеет самое широкое применение. Мясо овец, называемое бараниной, пользуется спросом и является основным мясным продуктом в мусульманских странах. В узком значении овца — это самка животного, самцов называют баранами. Овцеводство, как отрасль животноводства в сельском хозяйстве, играет огромную роль во многих мировых экономиках.",
      price: 200,
      sellMultiplier: DEFAULT_SELL_MULTIPLIER,
    },
    {
      harvestTimeout: 18 * HOUR,
      type: AnimalEnum.CowAnimal,
      name: "Корова",
      description:
        "Особая ценность молочной коровы как сельскохозяйственного животного зависит от ее способности потреблять и переваривать большое количество грубых кормов и превращать их в молоко и мясо, особенно хорошо усвояемые человеком.",
      price: 300,
      sellMultiplier: DEFAULT_SELL_MULTIPLIER,
    },
    {
      harvestTimeout: 24 * HOUR,
      type: AnimalEnum.PigAnimal,
      name: "Свинья",
      description:
        "По сравнению с другими парнокопытными, которые чаще бывают растительноядными, домашняя свинья всеядна, как и её предок, дикий кабан. Свиньи выращиваются в основном ради мяса и сала. Мировое производство свинины в 2005 году составило 97,2 млн т",
      price: 400,
      sellMultiplier: DEFAULT_SELL_MULTIPLIER,
    },
  ],
  // WARNING: order metters
  animalProducts: [
    {
      type: AnimalProductEnum.Hen,
      name: "Курица",
      description:
        "В зависимости от породы, куры имеют различный вес, примерно 0,8 – 5 кг, а также различаются по окраске пера, цвету яиц, размеру и некоторым внешним признакам (характерным для декоративных пород). Петухи обычно крупнее самок, у них более яркое оперение и длинный хвост. С возрастом на ногах у петуха образуются шпоры – костные выросты. Куры и петухи имеют бородку и гребень, которые выполняют функцию терморегулятора и обеспечивают нормальный приток крови к коже. Гребень петуха гораздо больше, чем у кур, у цыплят он малозаметен. Формы гребня могут быть листовидными с зубцами по краю, стручковидными и др. Несмотря на то, что у кур есть крылья, они неспособны к длительному и высокому полету.",
      price: 10,
      sellMultiplier: DEFAULT_SELL_MULTIPLIER,
    },
    {
      type: AnimalProductEnum.Sheep,
      name: "Овца",
      description:
        "Современная овца очень давно одомашнена человеком, который нуждался в шерсти и съедобном мясе. Это животное — млекопитающее, оно относится к роду баранов из обширного семейства полорогих. Овечья шерсть и сейчас имеет самое широкое применение. Мясо овец, называемое бараниной, пользуется спросом и является основным мясным продуктом в мусульманских странах. В узком значении овца — это самка животного, самцов называют баранами. Овцеводство, как отрасль животноводства в сельском хозяйстве, играет огромную роль во многих мировых экономиках.",
      price: 20,
      sellMultiplier: DEFAULT_SELL_MULTIPLIER,
    },
    {
      type: AnimalProductEnum.Cow,
      name: "Корова",
      description:
        "Особая ценность молочной коровы как сельскохозяйственного животного зависит от ее способности потреблять и переваривать большое количество грубых кормов и превращать их в молоко и мясо, особенно хорошо усвояемые человеком.",
      price: 30,
      sellMultiplier: DEFAULT_SELL_MULTIPLIER,
    },
    {
      type: AnimalProductEnum.Pig,
      name: "Свинья",
      description:
        "По сравнению с другими парнокопытными, которые чаще бывают растительноядными, домашняя свинья всеядна, как и её предок, дикий кабан. Свиньи выращиваются в основном ради мяса и сала. Мировое производство свинины в 2005 году составило 97,2 млн т",
      price: 40,
      sellMultiplier: DEFAULT_SELL_MULTIPLIER,
    },
  ],
  // WARNING: order metters
  seeds: [
    {
      harvestTimeout: 5 * MINUTE,
      type: SeedEnum.CarrotSeed,
      name: "Морковь",
      description:
        "Обычно в быту под словом «морковь» подразумевается широко распространённый корнеплод именно этого растения, который обычно относят к овощам.",
      price: 10,
      sellMultiplier: DEFAULT_SELL_MULTIPLIER,
    },
    {
      harvestTimeout: 10 * MINUTE,
      type: SeedEnum.BeetSeed,
      name: "Свекла",
      description:
        "Сахарная свекла в Российской Федерации является основным источником получения одного из ценнейших продуктов питания – сахара. Доля свекловичного сахара в общем объеме производства составляет 65,5%. В процессе переработки сахарной свеклы, помимо сахара, получают мелассу и жом. В промышленности мелассу используют для производства органических кислот, дрожжей и спирта. В сельском хозяйстве она является ценной кормовой добавкой животным.",
      price: 20,
      sellMultiplier: DEFAULT_SELL_MULTIPLIER,
    },
    {
      harvestTimeout: 15 * MINUTE,
      type: SeedEnum.PotatoSeed,
      name: "Картофель",
      description:
        "Клубни картофеля являются важным пищевым продуктом. Плоды ядовиты в связи с содержанием в них соланина. С потребительской точки зрения картофель является овощем.",
      price: 30,
      sellMultiplier: DEFAULT_SELL_MULTIPLIER,
    },
    {
      harvestTimeout: 20 * MINUTE,
      type: SeedEnum.WheatSeed,
      name: "Пшеница",
      description:
        "Получаемая из зёрен пшеницы мука используется при выпекании хлеба, изготовлении макаронных и кондитерских изделий. Пшеница также используется как кормовая культура, входит в некоторые рецепты приготовления пива и водки, а также виски.",
      price: 40,
      sellMultiplier: DEFAULT_SELL_MULTIPLIER,
    },
    {
      harvestTimeout: 25 * MINUTE,
      type: SeedEnum.FlowerSeed,
      name: "Цветы",
      description:
        "Растения выращивают для украшения парков, скверов, садов, различных помещений, для получения цветов на срезку. Одни растения выращивают в открытом грунте, другие — в теплицах, оранжереях, комнатах. Заниматься цветоводством люди начали в глубокой древности.",
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
        "Обычно в быту под словом «морковь» подразумевается широко распространённый корнеплод именно этого растения, который обычно относят к овощам.",
      price: 12,
      sellMultiplier: 1,
    },
    {
      type: SeedProductEnum.Beet,
      name: "Свекла",
      description:
        "Сахарная свекла в Российской Федерации является основным источником получения одного из ценнейших продуктов питания – сахара. Доля свекловичного сахара в общем объеме производства составляет 65,5%. В процессе переработки сахарной свеклы, помимо сахара, получают мелассу и жом. В промышленности мелассу используют для производства органических кислот, дрожжей и спирта. В сельском хозяйстве она является ценной кормовой добавкой животным.",
      price: 24,
      sellMultiplier: 1,
    },
    {
      type: SeedProductEnum.Potato,
      name: "Картофель",
      description:
        "Клубни картофеля являются важным пищевым продуктом. Плоды ядовиты в связи с содержанием в них соланина. С потребительской точки зрения картофель является овощем.",
      price: 36,
      sellMultiplier: 1,
    },
    {
      type: SeedProductEnum.Wheat,
      name: "Пшеница",
      description:
        "Получаемая из зёрен пшеницы мука используется при выпекании хлеба, изготовлении макаронных и кондитерских изделий. Пшеница также используется как кормовая культура, входит в некоторые рецепты приготовления пива и водки, а также виски.",
      price: 48,
      sellMultiplier: 1,
    },
    {
      type: SeedProductEnum.Flower,
      name: "Цветы",
      description:
        "Растения выращивают для украшения парков, скверов, садов, различных помещений, для получения цветов на срезку. Одни растения выращивают в открытом грунте, другие — в теплицах, оранжереях, комнатах. Заниматься цветоводством люди начали в глубокой древности.",
      price: 60,
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const inventoryItemRepo = queryRunner.manager.getRepository(InventoryItem);
    await inventoryItemRepo.delete({});
  }
}

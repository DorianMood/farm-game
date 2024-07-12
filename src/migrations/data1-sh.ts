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

export class Sh2000000000001 implements MigrationInterface {
  name = "Sh2000000000001";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Animals
    const animals: InventoryItem[] = [];

    const cow = new Animal();
    cow.harvestTimeout = 24 * 60 * 60 * 1000;
    cow.type = AnimalEnum.CowAnimal;
    const farmProduct = new InventoryItem();
    farmProduct.name = "Корова";
    farmProduct.description =
      "Особая ценность молочной коровы как сельскохозяйственного животного зависит от ее способности потреблять и переваривать большое количество грубых кормов и превращать их в молоко и мясо, особенно хорошо усвояемые человеком.";
    farmProduct.price = 100;
    farmProduct.animal = cow;
    farmProduct.sellMultiplier = 1;
    farmProduct.category = InventoryItemCategoryEnum.Animal;
    animals.push(farmProduct);

    const sheep = new Animal();
    sheep.harvestTimeout = 24 * 60 * 60 * 1000;
    sheep.type = AnimalEnum.SheepAnimal;
    const farmProductSheep = new InventoryItem();
    farmProductSheep.name = "Овца";
    farmProductSheep.description =
      "Современная овца очень давно одомашнена человеком, который нуждался в шерсти и съедобном мясе. Это животное — млекопитающее, оно относится к роду баранов из обширного семейства полорогих. Овечья шерсть и сейчас имеет самое широкое применение. Мясо овец, называемое бараниной, пользуется спросом и является основным мясным продуктом в мусульманских странах. В узком значении овца — это самка животного, самцов называют баранами. Овцеводство, как отрасль животноводства в сельском хозяйстве, играет огромную роль во многих мировых экономиках.";
    farmProductSheep.price = 100;
    farmProductSheep.animal = sheep;
    farmProductSheep.sellMultiplier = 1;
    farmProductSheep.category = InventoryItemCategoryEnum.Animal;
    animals.push(farmProductSheep);

    const hen = new Animal();
    hen.harvestTimeout = 24 * 60 * 60 * 1000;
    hen.type = AnimalEnum.HenAnimal;
    const farmProductHen = new InventoryItem();
    farmProductHen.name = "Курица";
    farmProductHen.description =
      "В зависимости от породы, куры имеют различный вес, примерно 0,8 – 5 кг, а также различаются по окраске пера, цвету яиц, размеру и некоторым внешним признакам (характерным для декоративных пород). Петухи обычно крупнее самок, у них более яркое оперение и длинный хвост. С возрастом на ногах у петуха образуются шпоры – костные выросты. Куры и петухи имеют бородку и гребень, которые выполняют функцию терморегулятора и обеспечивают нормальный приток крови к коже. Гребень петуха гораздо больше, чем у кур, у цыплят он малозаметен. Формы гребня могут быть листовидными с зубцами по краю, стручковидными и др. Несмотря на то, что у кур есть крылья, они неспособны к длительному и высокому полету.";
    farmProductHen.price = 100;
    farmProductHen.animal = hen;
    farmProductHen.sellMultiplier = 1;
    farmProductHen.category = InventoryItemCategoryEnum.Animal;
    animals.push(farmProductHen);

    const pig = new Animal();
    pig.harvestTimeout = 24 * 60 * 60 * 1000;
    pig.type = AnimalEnum.PigAnimal;
    const farmProductPig = new InventoryItem();
    farmProductPig.name = "Свинья";
    farmProductPig.description =
      "По сравнению с другими парнокопытными, которые чаще бывают растительноядными, домашняя свинья всеядна, как и её предок, дикий кабан. Свиньи выращиваются в основном ради мяса и сала. Мировое производство свинины в 2005 году составило 97,2 млн т";
    farmProductPig.price = 100;
    farmProductPig.animal = pig;
    farmProductPig.sellMultiplier = 1;
    farmProductPig.category = InventoryItemCategoryEnum.Animal;
    animals.push(farmProductPig);

    // Animals
    const animalProducts: InventoryItem[] = [];

    const cowProduct = new AnimalProduct();
    cowProduct.type = AnimalProductEnum.Cow;
    const farmProductCowProduct = new InventoryItem();
    farmProductCowProduct.name = "Корова";
    farmProductCowProduct.description =
      "Особая ценность молочной коровы как сельскохозяйственного животного зависит от ее способности потреблять и переваривать большое количество грубых кормов и превращать их в молоко и мясо, особенно хорошо усвояемые человеком.";
    farmProductCowProduct.price = 100;
    farmProductCowProduct.animalProduct = cowProduct;
    farmProductCowProduct.sellMultiplier = 1;
    farmProductCowProduct.category = InventoryItemCategoryEnum.AnimalProduct;
    animalProducts.push(farmProductCowProduct);

    const sheepProduct = new AnimalProduct();
    sheepProduct.type = AnimalProductEnum.Sheep;
    const farmProductSheepProduct = new InventoryItem();
    farmProductSheepProduct.name = "Овца";
    farmProductSheepProduct.description =
      "Современная овца очень давно одомашнена человеком, который нуждался в шерсти и съедобном мясе. Это животное — млекопитающее, оно относится к роду баранов из обширного семейства полорогих. Овечья шерсть и сейчас имеет самое широкое применение. Мясо овец, называемое бараниной, пользуется спросом и является основным мясным продуктом в мусульманских странах. В узком значении овца — это самка животного, самцов называют баранами. Овцеводство, как отрасль животноводства в сельском хозяйстве, играет огромную роль во многих мировых экономиках.";
    farmProductSheepProduct.price = 100;
    farmProductSheepProduct.animalProduct = sheepProduct;
    farmProductSheepProduct.sellMultiplier = 1;
    farmProductSheepProduct.category = InventoryItemCategoryEnum.AnimalProduct;
    animalProducts.push(farmProductSheepProduct);

    const henProduct = new AnimalProduct();
    henProduct.type = AnimalProductEnum.Hen;
    const farmProductHenProduct = new InventoryItem();
    farmProductHenProduct.name = "Курица";
    farmProductHenProduct.description =
      "В зависимости от породы, куры имеют различный вес, примерно 0,8 – 5 кг, а также различаются по окраске пера, цвету яиц, размеру и некоторым внешним признакам (характерным для декоративных пород). Петухи обычно крупнее самок, у них более яркое оперение и длинный хвост. С возрастом на ногах у петуха образуются шпоры – костные выросты. Куры и петухи имеют бородку и гребень, которые выполняют функцию терморегулятора и обеспечивают нормальный приток крови к коже. Гребень петуха гораздо больше, чем у кур, у цыплят он малозаметен. Формы гребня могут быть листовидными с зубцами по краю, стручковидными и др. Несмотря на то, что у кур есть крылья, они неспособны к длительному и высокому полету.";
    farmProductHenProduct.price = 100;
    farmProductHenProduct.animalProduct = henProduct;
    farmProductHenProduct.sellMultiplier = 1;
    farmProductHenProduct.category = InventoryItemCategoryEnum.AnimalProduct;
    animalProducts.push(farmProductHenProduct);

    const pigProduct = new AnimalProduct();
    pigProduct.type = AnimalProductEnum.Pig;
    const farmProductPigProduct = new InventoryItem();
    farmProductPigProduct.name = "Свинья";
    farmProductPigProduct.description =
      "По сравнению с другими парнокопытными, которые чаще бывают растительноядными, домашняя свинья всеядна, как и её предок, дикий кабан. Свиньи выращиваются в основном ради мяса и сала. Мировое производство свинины в 2005 году составило 97,2 млн т";
    farmProductPigProduct.price = 100;
    farmProductPigProduct.animalProduct = pigProduct;
    farmProductPigProduct.sellMultiplier = 1;
    farmProductPigProduct.category = InventoryItemCategoryEnum.AnimalProduct;
    animalProducts.push(farmProductPigProduct);

    // Plants
    const seedProducts: InventoryItem[] = [];

    const carrot = new SeedProduct();
    carrot.type = SeedProductEnum.Carrot;
    const farmProductCarrot = new InventoryItem();
    farmProductCarrot.name = "Морковь";
    farmProductCarrot.description =
      "Обычно в быту под словом «морковь» подразумевается широко распространённый корнеплод именно этого растения, который обычно относят к овощам.";
    farmProductCarrot.price = 100;
    farmProductCarrot.seedProduct = carrot;
    farmProductCarrot.sellMultiplier = 1;
    farmProductCarrot.category = InventoryItemCategoryEnum.SeedProduct;
    seedProducts.push(farmProductCarrot);

    const beet = new SeedProduct();
    beet.type = SeedProductEnum.Beet;
    const farmProductBeet = new InventoryItem();
    farmProductBeet.name = "Свекла";
    farmProductBeet.description =
      "Сахарная свекла в Российской Федерации является основным источником получения одного из ценнейших продуктов питания – сахара. Доля свекловичного сахара в общем объеме производства составляет 65,5%. В процессе переработки сахарной свеклы, помимо сахара, получают мелассу и жом. В промышленности мелассу используют для производства органических кислот, дрожжей и спирта. В сельском хозяйстве она является ценной кормовой добавкой животным.";
    farmProductBeet.price = 100;
    farmProductBeet.seedProduct = beet;
    farmProductBeet.sellMultiplier = 1;
    farmProductBeet.category = InventoryItemCategoryEnum.SeedProduct;
    seedProducts.push(farmProductBeet);

    const potato = new SeedProduct();
    potato.type = SeedProductEnum.Potato;
    const farmProductPotato = new InventoryItem();
    farmProductPotato.name = "Картофель";
    farmProductPotato.description =
      "Клубни картофеля являются важным пищевым продуктом. Плоды ядовиты в связи с содержанием в них соланина. С потребительской точки зрения картофель является овощем.";
    farmProductPotato.price = 100;
    farmProductPotato.seedProduct = potato;
    farmProductPotato.sellMultiplier = 1;
    farmProductPotato.category = InventoryItemCategoryEnum.SeedProduct;
    seedProducts.push(farmProductPotato);

    const wheat = new SeedProduct();
    wheat.type = SeedProductEnum.Wheat;
    const farmProductWheat = new InventoryItem();
    farmProductWheat.name = "Пшеница";
    farmProductWheat.description =
      "Получаемая из зёрен пшеницы мука используется при выпекании хлеба, изготовлении макаронных и кондитерских изделий. Пшеница также используется как кормовая культура, входит в некоторые рецепты приготовления пива и водки, а также виски.";
    farmProductWheat.price = 100;
    farmProductWheat.seedProduct = wheat;
    farmProductWheat.sellMultiplier = 1;
    farmProductWheat.category = InventoryItemCategoryEnum.SeedProduct;
    seedProducts.push(farmProductWheat);

    const flower = new SeedProduct();
    flower.type = SeedProductEnum.Flower;
    const farmProductFlower = new InventoryItem();
    farmProductFlower.name = "Цветы";
    farmProductFlower.description =
      "Растения выращивают для украшения парков, скверов, садов, различных помещений, для получения цветов на срезку. Одни растения выращивают в открытом грунте, другие — в теплицах, оранжереях, комнатах. Заниматься цветоводством люди начали в глубокой древности.";
    farmProductFlower.price = 100;
    farmProductFlower.seedProduct = flower;
    farmProductFlower.sellMultiplier = 1;
    farmProductFlower.category = InventoryItemCategoryEnum.SeedProduct;
    seedProducts.push(farmProductFlower);

    // Seeds
    const seeds: InventoryItem[] = [];

    const carrotSeed = new Seed();
    carrotSeed.harvestTimeout = 5 * 60 * 1000;
    carrotSeed.type = SeedEnum.CarrotSeed;
    const farmProductCarrotSeed = new InventoryItem();
    farmProductCarrotSeed.name = "Морковь";
    farmProductCarrotSeed.description =
      "Обычно в быту под словом «морковь» подразумевается широко распространённый корнеплод именно этого растения, который обычно относят к овощам.";
    farmProductCarrotSeed.price = 100;
    farmProductCarrotSeed.seed = carrotSeed;
    farmProductCarrotSeed.sellMultiplier = 1;
    farmProductCarrotSeed.category = InventoryItemCategoryEnum.Seed;
    seeds.push(farmProductCarrotSeed);

    const beetSeed = new Seed();
    beetSeed.harvestTimeout = 10 * 60 * 1000;
    beetSeed.type = SeedEnum.BeetSeed;
    const farmProductBeetSeed = new InventoryItem();
    farmProductBeetSeed.name = "Свекла";
    farmProductBeetSeed.description =
      "Сахарная свекла в Российской Федерации является основным источником получения одного из ценнейших продуктов питания – сахара. Доля свекловичного сахара в общем объеме производства составляет 65,5%. В процессе переработки сахарной свеклы, помимо сахара, получают мелассу и жом. В промышленности мелассу используют для производства органических кислот, дрожжей и спирта. В сельском хозяйстве она является ценной кормовой добавкой животным.";
    farmProductBeetSeed.price = 100;
    farmProductBeetSeed.seed = beetSeed;
    farmProductBeetSeed.sellMultiplier = 1;
    farmProductBeetSeed.category = InventoryItemCategoryEnum.Seed;
    seeds.push(farmProductBeetSeed);

    const potatoSeed = new Seed();
    potatoSeed.harvestTimeout = 15 * 60 * 1000;
    potatoSeed.type = SeedEnum.PotatoSeed;
    const farmProductPotatoSeed = new InventoryItem();
    farmProductPotatoSeed.name = "Картофель";
    farmProductPotatoSeed.description =
      "Клубни картофеля являются важным пищевым продуктом. Плоды ядовиты в связи с содержанием в них соланина. С потребительской точки зрения картофель является овощем.";
    farmProductPotatoSeed.price = 100;
    farmProductPotatoSeed.seed = potatoSeed;
    farmProductPotatoSeed.sellMultiplier = 1;
    farmProductPotatoSeed.category = InventoryItemCategoryEnum.Seed;
    seeds.push(farmProductPotatoSeed);

    const wheatSeed = new Seed();
    wheatSeed.harvestTimeout = 20 * 60 * 1000;
    wheatSeed.type = SeedEnum.WheatSeed;
    const farmProductWheatSeed = new InventoryItem();
    farmProductWheatSeed.name = "Пшеница";
    farmProductWheatSeed.description =
      "Получаемая из зёрен пшеницы мука используется при выпекании хлеба, изготовлении макаронных и кондитерских изделий. Пшеница также используется как кормовая культура, входит в некоторые рецепты приготовления пива и водки, а также виски.";
    farmProductWheatSeed.price = 100;
    farmProductWheatSeed.seed = wheatSeed;
    farmProductWheatSeed.sellMultiplier = 1;
    farmProductWheatSeed.category = InventoryItemCategoryEnum.Seed;
    seeds.push(farmProductWheatSeed);

    const flowerSeed = new Seed();
    flowerSeed.harvestTimeout = 25 * 60 * 1000;
    flowerSeed.type = SeedEnum.FlowerSeed;
    const farmProductFlowerSeed = new InventoryItem();
    farmProductFlowerSeed.name = "Цветы";
    farmProductFlowerSeed.description =
      "Растения выращивают для украшения парков, скверов, садов, различных помещений, для получения цветов на срезку. Одни растения выращивают в открытом грунте, другие — в теплицах, оранжереях, комнатах. Заниматься цветоводством люди начали в глубокой древности.";
    farmProductFlowerSeed.price = 100;
    farmProductFlowerSeed.seed = flowerSeed;
    farmProductFlowerSeed.sellMultiplier = 1;
    farmProductFlowerSeed.category = InventoryItemCategoryEnum.Seed;
    seeds.push(farmProductFlowerSeed);

    // Save data

    const inventoryItemRepo = queryRunner.manager.getRepository(InventoryItem);

    await inventoryItemRepo.save(animals);
    await inventoryItemRepo.save(animalProducts);
    await inventoryItemRepo.save(seedProducts);
    await inventoryItemRepo.save(seeds);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const inventoryItemRepo = queryRunner.manager.getRepository(InventoryItem);
    await inventoryItemRepo.delete({});
  }
}

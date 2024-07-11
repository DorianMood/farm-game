import { MigrationInterface, QueryRunner } from "typeorm";

import { Animal } from "../entities/animal";
import { FarmProduct } from "../entities/farm-product";
import { Seed } from "../entities/seed";
import { CropEnum, PetEnum } from "../common/enums";
import { Plant } from "../entities/plant";

/**
 * INFO:
 * This a data migration, it will be executed when the database is first created.
 * It doesnt change the database schema but only fill the database with data.
 **/

// INFO: this migration creates all possible animal, plants and seeds

export class Sh1719237436737 implements MigrationInterface {
  name = "Sh1719237436737";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Animals
    const animals = [];

    const cow = new Animal();
    cow.name = "Корова";
    cow.description =
      "Особая ценность молочной коровы как сельскохозяйственного животного зависит от ее способности потреблять и переваривать большое количество грубых кормов и превращать их в молоко и мясо, особенно хорошо усвояемые человеком.";
    cow.harvestTimeout = 24 * 60 * 60 * 1000;
    cow.pet = PetEnum.Cow;
    const farmProduct = new FarmProduct();
    farmProduct.price = 100;
    farmProduct.animal = cow;
    farmProduct.sellMultiplier = 1;
    animals.push(farmProduct);

    const sheep = new Animal();
    sheep.name = "Овца";
    sheep.description =
      "Современная овца очень давно одомашнена человеком, который нуждался в шерсти и съедобном мясе. Это животное — млекопитающее, оно относится к роду баранов из обширного семейства полорогих. Овечья шерсть и сейчас имеет самое широкое применение. Мясо овец, называемое бараниной, пользуется спросом и является основным мясным продуктом в мусульманских странах. В узком значении овца — это самка животного, самцов называют баранами. Овцеводство, как отрасль животноводства в сельском хозяйстве, играет огромную роль во многих мировых экономиках.";
    sheep.harvestTimeout = 24 * 60 * 60 * 1000;
    sheep.pet = PetEnum.Sheep;
    const farmProductSheep = new FarmProduct();
    farmProductSheep.price = 100;
    farmProductSheep.animal = sheep;
    farmProductSheep.sellMultiplier = 1;
    animals.push(farmProductSheep);

    const hen = new Animal();
    hen.name = "Курица";
    hen.description =
      "В зависимости от породы, куры имеют различный вес, примерно 0,8 – 5 кг, а также различаются по окраске пера, цвету яиц, размеру и некоторым внешним признакам (характерным для декоративных пород). Петухи обычно крупнее самок, у них более яркое оперение и длинный хвост. С возрастом на ногах у петуха образуются шпоры – костные выросты. Куры и петухи имеют бородку и гребень, которые выполняют функцию терморегулятора и обеспечивают нормальный приток крови к коже. Гребень петуха гораздо больше, чем у кур, у цыплят он малозаметен. Формы гребня могут быть листовидными с зубцами по краю, стручковидными и др. Несмотря на то, что у кур есть крылья, они неспособны к длительному и высокому полету.";
    hen.harvestTimeout = 24 * 60 * 60 * 1000;
    hen.pet = PetEnum.Hen;
    const farmProductHen = new FarmProduct();
    farmProductHen.price = 100;
    farmProductHen.animal = hen;
    farmProductHen.sellMultiplier = 1;
    animals.push(farmProductHen);

    const pig = new Animal();
    pig.name = "Свинья";
    pig.description =
      "По сравнению с другими парнокопытными, которые чаще бывают растительноядными, домашняя свинья всеядна, как и её предок, дикий кабан. Свиньи выращиваются в основном ради мяса и сала. Мировое производство свинины в 2005 году составило 97,2 млн т";
    pig.harvestTimeout = 24 * 60 * 60 * 1000;
    pig.pet = PetEnum.Pig;
    const farmProductPig = new FarmProduct();
    farmProductPig.price = 100;
    farmProductPig.animal = pig;
    farmProductPig.sellMultiplier = 1;
    animals.push(farmProductPig);

    // Plants
    const plants = [];

    const carrot = new Plant();
    carrot.name = "Морковь";
    carrot.description = "";
    carrot.harvestTimeout = 24 * 60 * 60 * 1000;
    carrot.crop = CropEnum.Carrot;
    const farmProductCarrot = new FarmProduct();
    farmProductCarrot.price = 100;
    farmProductCarrot.plant = carrot;
    farmProductCarrot.sellMultiplier = 1;
    plants.push(farmProductCarrot);

    const beet = new Plant();
    beet.name = "Свекла";
    beet.description = "";
    beet.harvestTimeout = 24 * 60 * 60 * 1000;
    beet.crop = CropEnum.Beet;
    const farmProductBeet = new FarmProduct();
    farmProductBeet.price = 100;
    farmProductBeet.plant = beet;
    farmProductBeet.sellMultiplier = 1;
    plants.push(farmProductBeet);

    const potato = new Plant();
    potato.name = "Картофель";
    potato.description = "";
    potato.harvestTimeout = 24 * 60 * 60 * 1000;
    potato.crop = CropEnum.Potato;
    const farmProductPotato = new FarmProduct();
    farmProductPotato.price = 100;
    farmProductPotato.plant = potato;
    farmProductPotato.sellMultiplier = 1;
    plants.push(farmProductPotato);

    const wheat = new Plant();
    wheat.name = "Пшеница";
    wheat.description = "";
    wheat.harvestTimeout = 24 * 60 * 60 * 1000;
    wheat.crop = CropEnum.Wheat;
    const farmProductWheat = new FarmProduct();
    farmProductWheat.price = 100;
    farmProductWheat.plant = wheat;
    farmProductWheat.sellMultiplier = 1;
    plants.push(farmProductWheat);

    const flower = new Plant();
    flower.name = "Цветы";
    flower.description = "";
    flower.harvestTimeout = 24 * 60 * 60 * 1000;
    flower.crop = CropEnum.Flower;
    const farmProductFlower = new FarmProduct();
    farmProductFlower.price = 100;
    farmProductFlower.plant = flower;
    farmProductFlower.sellMultiplier = 1;
    plants.push(farmProductFlower);

    // Seeds
    const seeds = [];

    const carrotSeed = new Seed();
    carrotSeed.plant = carrot;
    const farmProductCarrotSeed = new FarmProduct();
    farmProductCarrotSeed.price = 100;
    farmProductCarrotSeed.seed = carrotSeed;
    farmProductCarrotSeed.sellMultiplier = 1;
    seeds.push(farmProductCarrotSeed);

    const beetSeed = new Seed();
    beetSeed.plant = beet;
    const farmProductBeetSeed = new FarmProduct();
    farmProductBeetSeed.price = 100;
    farmProductBeetSeed.seed = beetSeed;
    farmProductBeetSeed.sellMultiplier = 1;
    seeds.push(farmProductBeetSeed);

    const potatoSeed = new Seed();
    potatoSeed.plant = potato;
    const farmProductPotatoSeed = new FarmProduct();
    farmProductPotatoSeed.price = 100;
    farmProductPotatoSeed.seed = potatoSeed;
    farmProductPotatoSeed.sellMultiplier = 1;
    seeds.push(farmProductPotatoSeed);

    const wheatSeed = new Seed();
    wheatSeed.plant = wheat;
    const farmProductWheatSeed = new FarmProduct();
    farmProductWheatSeed.price = 100;
    farmProductWheatSeed.seed = wheatSeed;
    farmProductWheatSeed.sellMultiplier = 1;
    seeds.push(farmProductWheatSeed);

    const flowerSeed = new Seed();
    flowerSeed.plant = flower;
    const farmProductFlowerSeed = new FarmProduct();
    farmProductFlowerSeed.price = 100;
    farmProductFlowerSeed.seed = flowerSeed;
    farmProductFlowerSeed.sellMultiplier = 1;
    seeds.push(farmProductFlowerSeed);

    // Save data

    const farmProductRepo = queryRunner.manager.getRepository(FarmProduct);

    await farmProductRepo.save(animals);
    await farmProductRepo.save(plants);
    await farmProductRepo.save(seeds);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.clear(FarmProduct);
  }
}

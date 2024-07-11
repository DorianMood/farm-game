import { MigrationInterface, QueryRunner } from "typeorm";

export class Sh1719237436734 implements MigrationInterface {
  name = "Sh1719237436734";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."bed_crop_enum" AS ENUM('Carrot', 'Potato', 'Beet', 'Wheat', 'Flower')`,
    );
    await queryRunner.query(
      `CREATE TABLE "bed" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "index" integer NOT NULL, "plantedAt" TIMESTAMP WITH TIME ZONE, "crop" "public"."bed_crop_enum", "userId" uuid, CONSTRAINT "PK_828b3f79eab8a8b1de6b6ed6c5a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "cost" integer NOT NULL, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "completedAt" TIMESTAMP WITH TIME ZONE, "userId" uuid, "taskId" uuid, CONSTRAINT "PK_ea320dbd04b37ad98f9ff5033f6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "price" integer NOT NULL, "picture" character varying NOT NULL, "content" character varying NOT NULL, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."animal_pet_enum" AS ENUM('Pig', 'Sheep', 'Cow', 'Chicken')`,
    );
    await queryRunner.query(
      `CREATE TABLE "animal" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "pet" "public"."animal_pet_enum" NOT NULL, "harvestTimeout" integer NOT NULL, "name" character varying NOT NULL, "description" text NOT NULL, CONSTRAINT "UQ_d23c55f0262ac85ac6d76308fe1" UNIQUE ("pet"), CONSTRAINT "PK_af42b1374c042fb3fa2251f9f42" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."plant_crop_enum" AS ENUM('Carrot', 'Potato', 'Beet', 'Wheat', 'Flower')`,
    );
    await queryRunner.query(
      `CREATE TABLE "plant" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "crop" "public"."plant_crop_enum" NOT NULL, "harvestTimeout" integer NOT NULL, "name" character varying NOT NULL, "description" text NOT NULL, CONSTRAINT "UQ_dd0646596e4f8977164aaeee334" UNIQUE ("crop"), CONSTRAINT "PK_97e1eb0d045aadea59401ece5ba" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "seed" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "plantId" uuid, CONSTRAINT "REL_b392780419e20dc06497929213" UNIQUE ("plantId"), CONSTRAINT "PK_e959d094217adb4d796a027d2c8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "farm_product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "price" integer NOT NULL, "sellMultiplier" integer NOT NULL, "animalId" uuid, "plantId" uuid, "seedId" uuid, CONSTRAINT "REL_0927c008ce8d2a169840cdb611" UNIQUE ("animalId"), CONSTRAINT "REL_7c82a3e43adb3b6cd2fc8edf66" UNIQUE ("plantId"), CONSTRAINT "REL_80e10a7bb7626ad0b97bb80ee8" UNIQUE ("seedId"), CONSTRAINT "PK_33bd1bc097d3acdfb19ae438f2a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "inventory_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" integer NOT NULL, "inventoryId" uuid, "farmProductId" uuid, CONSTRAINT "PK_94f5cbcb5f280f2f30bd4a9fd90" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "inventory" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" uuid, CONSTRAINT "PK_82aa5da437c5bbfb80703b08309" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "username" character varying(20) NOT NULL, "email" character varying(255) NOT NULL, "hashPassword" character varying NOT NULL, "salt" character varying NOT NULL, "ballance" integer NOT NULL DEFAULT '0', CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "question" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "question" character varying NOT NULL, "answer" character varying NOT NULL, "surveyId" uuid, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "survey" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "taskId" uuid, CONSTRAINT "PK_f0da32b9181e9c02ecf0be11ed3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_products_product" ("userId" uuid NOT NULL, "productId" uuid NOT NULL, CONSTRAINT "PK_31e9c4932027ab0d5b459b4bbe9" PRIMARY KEY ("userId", "productId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f75a259330a1b34d6c68206b42" ON "user_products_product" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8e92508a7e69cb8011f4bbf9b2" ON "user_products_product" ("productId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "bed" ADD CONSTRAINT "FK_b08100365b86e2621c15626f4c3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" ADD CONSTRAINT "FK_4df8c371c74decf9ef093358dad" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" ADD CONSTRAINT "FK_be3c9f1acbe21e0070039b5cf79" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "seed" ADD CONSTRAINT "FK_b392780419e20dc06497929213b" FOREIGN KEY ("plantId") REFERENCES "plant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "farm_product" ADD CONSTRAINT "FK_0927c008ce8d2a169840cdb611f" FOREIGN KEY ("animalId") REFERENCES "animal"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "farm_product" ADD CONSTRAINT "FK_7c82a3e43adb3b6cd2fc8edf66e" FOREIGN KEY ("plantId") REFERENCES "plant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "farm_product" ADD CONSTRAINT "FK_80e10a7bb7626ad0b97bb80ee8e" FOREIGN KEY ("seedId") REFERENCES "seed"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_item" ADD CONSTRAINT "FK_ce6b6a0a8ba96d183b0d2104621" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_item" ADD CONSTRAINT "FK_e289d535e825cd336c874e42c18" FOREIGN KEY ("farmProductId") REFERENCES "farm_product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" ADD CONSTRAINT "FK_fe4917e809e078929fe517ab762" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ADD CONSTRAINT "FK_a1188e0f702ab268e0982049e5c" FOREIGN KEY ("surveyId") REFERENCES "survey"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "survey" ADD CONSTRAINT "FK_f2caadc7f5c1d5dceb1544f3a70" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_products_product" ADD CONSTRAINT "FK_f75a259330a1b34d6c68206b42f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_products_product" ADD CONSTRAINT "FK_8e92508a7e69cb8011f4bbf9b2e" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_products_product" DROP CONSTRAINT "FK_8e92508a7e69cb8011f4bbf9b2e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_products_product" DROP CONSTRAINT "FK_f75a259330a1b34d6c68206b42f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "survey" DROP CONSTRAINT "FK_f2caadc7f5c1d5dceb1544f3a70"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" DROP CONSTRAINT "FK_a1188e0f702ab268e0982049e5c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" DROP CONSTRAINT "FK_fe4917e809e078929fe517ab762"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_item" DROP CONSTRAINT "FK_e289d535e825cd336c874e42c18"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_item" DROP CONSTRAINT "FK_ce6b6a0a8ba96d183b0d2104621"`,
    );
    await queryRunner.query(
      `ALTER TABLE "farm_product" DROP CONSTRAINT "FK_80e10a7bb7626ad0b97bb80ee8e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "farm_product" DROP CONSTRAINT "FK_7c82a3e43adb3b6cd2fc8edf66e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "farm_product" DROP CONSTRAINT "FK_0927c008ce8d2a169840cdb611f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "seed" DROP CONSTRAINT "FK_b392780419e20dc06497929213b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" DROP CONSTRAINT "FK_be3c9f1acbe21e0070039b5cf79"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" DROP CONSTRAINT "FK_4df8c371c74decf9ef093358dad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bed" DROP CONSTRAINT "FK_b08100365b86e2621c15626f4c3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8e92508a7e69cb8011f4bbf9b2"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f75a259330a1b34d6c68206b42"`,
    );
    await queryRunner.query(`DROP TABLE "user_products_product"`);
    await queryRunner.query(`DROP TABLE "survey"`);
    await queryRunner.query(`DROP TABLE "question"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "inventory"`);
    await queryRunner.query(`DROP TABLE "inventory_item"`);
    await queryRunner.query(`DROP TABLE "farm_product"`);
    await queryRunner.query(`DROP TABLE "seed"`);
    await queryRunner.query(`DROP TABLE "plant"`);
    await queryRunner.query(`DROP TYPE "public"."plant_crop_enum"`);
    await queryRunner.query(`DROP TABLE "animal"`);
    await queryRunner.query(`DROP TYPE "public"."animal_pet_enum"`);
    await queryRunner.query(`DROP TABLE "product"`);
    await queryRunner.query(`DROP TABLE "user_task"`);
    await queryRunner.query(`DROP TABLE "task"`);
    await queryRunner.query(`DROP TABLE "bed"`);
    await queryRunner.query(`DROP TYPE "public"."bed_crop_enum"`);
  }
}

import { MigrationInterface, QueryRunner } from "typeorm";

export class Sh1721395765712 implements MigrationInterface {
    name = 'Sh1721395765712'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."animal_product_type_enum" AS ENUM('Pig', 'Cow', 'Sheep', 'Hen')`);
        await queryRunner.query(`CREATE TABLE "animal_product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."animal_product_type_enum" NOT NULL, "inventoryItemId" uuid, "animalId" uuid, CONSTRAINT "UQ_5a6a6a2cde5fc23c60aa8934cff" UNIQUE ("type"), CONSTRAINT "REL_5f09449719fef5d756ce698c2d" UNIQUE ("inventoryItemId"), CONSTRAINT "PK_148dc2b33cada00239ec5436cb2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."animal_type_enum" AS ENUM('PigAnimal', 'CowAnimal', 'SheepAnimal', 'HenAnimal')`);
        await queryRunner.query(`CREATE TABLE "animal" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."animal_type_enum" NOT NULL, "harvestTimeout" integer NOT NULL, "inventoryItemId" uuid, CONSTRAINT "UQ_1ce8064319ac591e3b23e02ff9e" UNIQUE ("type"), CONSTRAINT "REL_000c1db0fb6866e6d392a164f9" UNIQUE ("inventoryItemId"), CONSTRAINT "PK_af42b1374c042fb3fa2251f9f42" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."seed_product_type_enum" AS ENUM('Carrot', 'Flower', 'Potato', 'Wheat', 'Beet')`);
        await queryRunner.query(`CREATE TABLE "seed_product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."seed_product_type_enum" NOT NULL, "inventoryItemId" uuid, "seedId" uuid, CONSTRAINT "UQ_56cf0998070719179af5ce2b771" UNIQUE ("type"), CONSTRAINT "REL_d5b4e0b8b02e161cfee6243dc4" UNIQUE ("inventoryItemId"), CONSTRAINT "PK_8b952652c71778abd12d322c04b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "promo_code" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "link" text NOT NULL, "inventoryItemId" uuid, CONSTRAINT "REL_a32507618614c5d540548f7fea" UNIQUE ("inventoryItemId"), CONSTRAINT "PK_ded0af550884c7ab3e345e76d73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."inventory_item_category_enum" AS ENUM('Seed', 'Animal', 'SeedProduct', 'AnimalProduct', 'PromoCode')`);
        await queryRunner.query(`CREATE TABLE "inventory_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "description" text NOT NULL, "price" integer NOT NULL, "sellMultiplier" double precision NOT NULL DEFAULT '1', "category" "public"."inventory_item_category_enum", CONSTRAINT "PK_94f5cbcb5f280f2f30bd4a9fd90" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."seed_type_enum" AS ENUM('CarrotSeed', 'BeetSeed', 'FlowerSeed', 'PotatoSeed', 'WheatSeed')`);
        await queryRunner.query(`CREATE TABLE "seed" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."seed_type_enum" NOT NULL, "harvestTimeout" integer NOT NULL, "inventoryItemId" uuid, CONSTRAINT "UQ_adbeceb8a8e9681c9bd05f6f9a1" UNIQUE ("type"), CONSTRAINT "REL_935bb4ede4290a3989e218914a" UNIQUE ("inventoryItemId"), CONSTRAINT "PK_e959d094217adb4d796a027d2c8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "bed" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "index" integer NOT NULL, "plantedAt" TIMESTAMP WITH TIME ZONE, "userId" uuid, "cropId" uuid, CONSTRAINT "PK_828b3f79eab8a8b1de6b6ed6c5a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "inventory_slot" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" integer NOT NULL, "inventoryId" uuid, "inventoryItemId" uuid, CONSTRAINT "PK_f9fac7ec28a6cb328f0be865b96" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "inventory" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_82aa5da437c5bbfb80703b08309" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "barn" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "index" integer NOT NULL, "startedAt" TIMESTAMP WITH TIME ZONE, "userId" uuid, "animalId" uuid, CONSTRAINT "PK_8a09a63714efc0a89bee85dd286" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "username" character varying(20) NOT NULL, "email" character varying(255) NOT NULL, "hashPassword" character varying NOT NULL, "salt" character varying NOT NULL, "ballance" integer NOT NULL DEFAULT '0', "inventoryId" uuid, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "REL_37a72f5ca7f3761eec5a9d2227" UNIQUE ("inventoryId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "completedAt" TIMESTAMP WITH TIME ZONE, "userId" uuid, "taskId" uuid, CONSTRAINT "PK_ea320dbd04b37ad98f9ff5033f6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "cost" integer NOT NULL, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "survey" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "taskId" uuid, CONSTRAINT "PK_f0da32b9181e9c02ecf0be11ed3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "question" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "question" character varying NOT NULL, "answer" character varying NOT NULL, "surveyId" uuid, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "animal_product" ADD CONSTRAINT "FK_5f09449719fef5d756ce698c2d4" FOREIGN KEY ("inventoryItemId") REFERENCES "inventory_item"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "animal_product" ADD CONSTRAINT "FK_9cef79005c1de5a42df008e4a4b" FOREIGN KEY ("animalId") REFERENCES "animal"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "animal" ADD CONSTRAINT "FK_000c1db0fb6866e6d392a164f9f" FOREIGN KEY ("inventoryItemId") REFERENCES "inventory_item"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "seed_product" ADD CONSTRAINT "FK_d5b4e0b8b02e161cfee6243dc4d" FOREIGN KEY ("inventoryItemId") REFERENCES "inventory_item"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "seed_product" ADD CONSTRAINT "FK_87967e438fea55eb4b6aa9110e4" FOREIGN KEY ("seedId") REFERENCES "seed"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "promo_code" ADD CONSTRAINT "FK_a32507618614c5d540548f7fea7" FOREIGN KEY ("inventoryItemId") REFERENCES "inventory_item"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "seed" ADD CONSTRAINT "FK_935bb4ede4290a3989e218914ae" FOREIGN KEY ("inventoryItemId") REFERENCES "inventory_item"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bed" ADD CONSTRAINT "FK_b08100365b86e2621c15626f4c3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "bed" ADD CONSTRAINT "FK_e0e6550cedbd668688c32c7a616" FOREIGN KEY ("cropId") REFERENCES "seed"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory_slot" ADD CONSTRAINT "FK_4790a8a3d41ad48046c20ef040c" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "inventory_slot" ADD CONSTRAINT "FK_6c60b238171d41f7154a9cb4654" FOREIGN KEY ("inventoryItemId") REFERENCES "inventory_item"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "barn" ADD CONSTRAINT "FK_1718881609080be35075544e2f0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "barn" ADD CONSTRAINT "FK_4d7fff8bf54709e153810e7d270" FOREIGN KEY ("animalId") REFERENCES "animal"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_37a72f5ca7f3761eec5a9d2227a" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_task" ADD CONSTRAINT "FK_4df8c371c74decf9ef093358dad" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_task" ADD CONSTRAINT "FK_be3c9f1acbe21e0070039b5cf79" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "survey" ADD CONSTRAINT "FK_f2caadc7f5c1d5dceb1544f3a70" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_a1188e0f702ab268e0982049e5c" FOREIGN KEY ("surveyId") REFERENCES "survey"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_a1188e0f702ab268e0982049e5c"`);
        await queryRunner.query(`ALTER TABLE "survey" DROP CONSTRAINT "FK_f2caadc7f5c1d5dceb1544f3a70"`);
        await queryRunner.query(`ALTER TABLE "user_task" DROP CONSTRAINT "FK_be3c9f1acbe21e0070039b5cf79"`);
        await queryRunner.query(`ALTER TABLE "user_task" DROP CONSTRAINT "FK_4df8c371c74decf9ef093358dad"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_37a72f5ca7f3761eec5a9d2227a"`);
        await queryRunner.query(`ALTER TABLE "barn" DROP CONSTRAINT "FK_4d7fff8bf54709e153810e7d270"`);
        await queryRunner.query(`ALTER TABLE "barn" DROP CONSTRAINT "FK_1718881609080be35075544e2f0"`);
        await queryRunner.query(`ALTER TABLE "inventory_slot" DROP CONSTRAINT "FK_6c60b238171d41f7154a9cb4654"`);
        await queryRunner.query(`ALTER TABLE "inventory_slot" DROP CONSTRAINT "FK_4790a8a3d41ad48046c20ef040c"`);
        await queryRunner.query(`ALTER TABLE "bed" DROP CONSTRAINT "FK_e0e6550cedbd668688c32c7a616"`);
        await queryRunner.query(`ALTER TABLE "bed" DROP CONSTRAINT "FK_b08100365b86e2621c15626f4c3"`);
        await queryRunner.query(`ALTER TABLE "seed" DROP CONSTRAINT "FK_935bb4ede4290a3989e218914ae"`);
        await queryRunner.query(`ALTER TABLE "promo_code" DROP CONSTRAINT "FK_a32507618614c5d540548f7fea7"`);
        await queryRunner.query(`ALTER TABLE "seed_product" DROP CONSTRAINT "FK_87967e438fea55eb4b6aa9110e4"`);
        await queryRunner.query(`ALTER TABLE "seed_product" DROP CONSTRAINT "FK_d5b4e0b8b02e161cfee6243dc4d"`);
        await queryRunner.query(`ALTER TABLE "animal" DROP CONSTRAINT "FK_000c1db0fb6866e6d392a164f9f"`);
        await queryRunner.query(`ALTER TABLE "animal_product" DROP CONSTRAINT "FK_9cef79005c1de5a42df008e4a4b"`);
        await queryRunner.query(`ALTER TABLE "animal_product" DROP CONSTRAINT "FK_5f09449719fef5d756ce698c2d4"`);
        await queryRunner.query(`DROP TABLE "question"`);
        await queryRunner.query(`DROP TABLE "survey"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TABLE "user_task"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "barn"`);
        await queryRunner.query(`DROP TABLE "inventory"`);
        await queryRunner.query(`DROP TABLE "inventory_slot"`);
        await queryRunner.query(`DROP TABLE "bed"`);
        await queryRunner.query(`DROP TABLE "seed"`);
        await queryRunner.query(`DROP TYPE "public"."seed_type_enum"`);
        await queryRunner.query(`DROP TABLE "inventory_item"`);
        await queryRunner.query(`DROP TYPE "public"."inventory_item_category_enum"`);
        await queryRunner.query(`DROP TABLE "promo_code"`);
        await queryRunner.query(`DROP TABLE "seed_product"`);
        await queryRunner.query(`DROP TYPE "public"."seed_product_type_enum"`);
        await queryRunner.query(`DROP TABLE "animal"`);
        await queryRunner.query(`DROP TYPE "public"."animal_type_enum"`);
        await queryRunner.query(`DROP TABLE "animal_product"`);
        await queryRunner.query(`DROP TYPE "public"."animal_product_type_enum"`);
    }

}

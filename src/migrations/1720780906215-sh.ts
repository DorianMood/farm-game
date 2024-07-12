import { MigrationInterface, QueryRunner } from "typeorm";

export class Sh1720780906215 implements MigrationInterface {
    name = 'Sh1720780906215'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."bed_crop_enum" AS ENUM('Carrot', 'Potato', 'Beet', 'Wheat', 'Flower')`);
        await queryRunner.query(`CREATE TABLE "bed" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "index" integer NOT NULL, "plantedAt" TIMESTAMP WITH TIME ZONE, "crop" "public"."bed_crop_enum", "userId" uuid, CONSTRAINT "PK_828b3f79eab8a8b1de6b6ed6c5a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "cost" integer NOT NULL, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "completedAt" TIMESTAMP WITH TIME ZONE, "userId" uuid, "taskId" uuid, CONSTRAINT "PK_ea320dbd04b37ad98f9ff5033f6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."animal_type_enum" AS ENUM('PigAnimal', 'CowAnimal', 'SheepAnimal', 'HenAnimal')`);
        await queryRunner.query(`CREATE TABLE "animal" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."animal_type_enum" NOT NULL, "harvestTimeout" integer NOT NULL, "farmProductId" uuid, CONSTRAINT "UQ_1ce8064319ac591e3b23e02ff9e" UNIQUE ("type"), CONSTRAINT "REL_510e4e5132f765d43272683091" UNIQUE ("farmProductId"), CONSTRAINT "PK_af42b1374c042fb3fa2251f9f42" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."seed_type_enum" AS ENUM('CarrotSeed', 'BeetSeed', 'FlowerSeed', 'PotatoSeed', 'WheatSeed')`);
        await queryRunner.query(`CREATE TABLE "seed" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."seed_type_enum" NOT NULL, "harvestTimeout" integer NOT NULL, "farmProductId" uuid, CONSTRAINT "UQ_adbeceb8a8e9681c9bd05f6f9a1" UNIQUE ("type"), CONSTRAINT "REL_f42ecc0c12985268fab60f1538" UNIQUE ("farmProductId"), CONSTRAINT "PK_e959d094217adb4d796a027d2c8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."seed_product_type_enum" AS ENUM('Carrot', 'Flower', 'Potato', 'Wheat', 'Beet')`);
        await queryRunner.query(`CREATE TABLE "seed_product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."seed_product_type_enum" NOT NULL, "farmProductId" uuid, CONSTRAINT "UQ_56cf0998070719179af5ce2b771" UNIQUE ("type"), CONSTRAINT "REL_b49992c69707f661e13ff51d81" UNIQUE ("farmProductId"), CONSTRAINT "PK_8b952652c71778abd12d322c04b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."animal_product_type_enum" AS ENUM('Pig', 'Cow', 'Sheep', 'Hen')`);
        await queryRunner.query(`CREATE TABLE "animal_product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."animal_product_type_enum" NOT NULL, "farmProductId" uuid, CONSTRAINT "UQ_5a6a6a2cde5fc23c60aa8934cff" UNIQUE ("type"), CONSTRAINT "REL_3acd78c84c89dd21d7433c74ac" UNIQUE ("farmProductId"), CONSTRAINT "PK_148dc2b33cada00239ec5436cb2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."farm_product_category_enum" AS ENUM('Seed', 'Animal', 'SeedProduct', 'AnimalProduct')`);
        await queryRunner.query(`CREATE TABLE "farm_product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "description" text NOT NULL, "price" integer NOT NULL, "sellMultiplier" integer NOT NULL, "category" "public"."farm_product_category_enum", CONSTRAINT "PK_33bd1bc097d3acdfb19ae438f2a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "inventory_slot" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" integer NOT NULL, "inventoryId" uuid, "farmProductId" uuid, CONSTRAINT "PK_f9fac7ec28a6cb328f0be865b96" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "inventory" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_82aa5da437c5bbfb80703b08309" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "username" character varying(20) NOT NULL, "email" character varying(255) NOT NULL, "hashPassword" character varying NOT NULL, "salt" character varying NOT NULL, "ballance" integer NOT NULL DEFAULT '0', CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "price" integer NOT NULL, "picture" character varying NOT NULL, "content" character varying NOT NULL, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "question" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "question" character varying NOT NULL, "answer" character varying NOT NULL, "surveyId" uuid, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "survey" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "taskId" uuid, CONSTRAINT "PK_f0da32b9181e9c02ecf0be11ed3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_users_user" ("productId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_4ebdd1fc9e9dd93b3c04a7a0e06" PRIMARY KEY ("productId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c6c22c0d9d9dcb04d0fa35a883" ON "product_users_user" ("productId") `);
        await queryRunner.query(`CREATE INDEX "IDX_cb233ded53aaa05c7bab8fa117" ON "product_users_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "bed" ADD CONSTRAINT "FK_b08100365b86e2621c15626f4c3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_task" ADD CONSTRAINT "FK_4df8c371c74decf9ef093358dad" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_task" ADD CONSTRAINT "FK_be3c9f1acbe21e0070039b5cf79" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "animal" ADD CONSTRAINT "FK_510e4e5132f765d432726830919" FOREIGN KEY ("farmProductId") REFERENCES "farm_product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "seed" ADD CONSTRAINT "FK_f42ecc0c12985268fab60f1538e" FOREIGN KEY ("farmProductId") REFERENCES "farm_product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "seed_product" ADD CONSTRAINT "FK_b49992c69707f661e13ff51d812" FOREIGN KEY ("farmProductId") REFERENCES "farm_product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "animal_product" ADD CONSTRAINT "FK_3acd78c84c89dd21d7433c74ac3" FOREIGN KEY ("farmProductId") REFERENCES "farm_product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory_slot" ADD CONSTRAINT "FK_4790a8a3d41ad48046c20ef040c" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "inventory_slot" ADD CONSTRAINT "FK_d9cd12932ad283fa925475b01fa" FOREIGN KEY ("farmProductId") REFERENCES "farm_product"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_a1188e0f702ab268e0982049e5c" FOREIGN KEY ("surveyId") REFERENCES "survey"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "survey" ADD CONSTRAINT "FK_f2caadc7f5c1d5dceb1544f3a70" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_users_user" ADD CONSTRAINT "FK_c6c22c0d9d9dcb04d0fa35a883d" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_users_user" ADD CONSTRAINT "FK_cb233ded53aaa05c7bab8fa1175" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_users_user" DROP CONSTRAINT "FK_cb233ded53aaa05c7bab8fa1175"`);
        await queryRunner.query(`ALTER TABLE "product_users_user" DROP CONSTRAINT "FK_c6c22c0d9d9dcb04d0fa35a883d"`);
        await queryRunner.query(`ALTER TABLE "survey" DROP CONSTRAINT "FK_f2caadc7f5c1d5dceb1544f3a70"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_a1188e0f702ab268e0982049e5c"`);
        await queryRunner.query(`ALTER TABLE "inventory_slot" DROP CONSTRAINT "FK_d9cd12932ad283fa925475b01fa"`);
        await queryRunner.query(`ALTER TABLE "inventory_slot" DROP CONSTRAINT "FK_4790a8a3d41ad48046c20ef040c"`);
        await queryRunner.query(`ALTER TABLE "animal_product" DROP CONSTRAINT "FK_3acd78c84c89dd21d7433c74ac3"`);
        await queryRunner.query(`ALTER TABLE "seed_product" DROP CONSTRAINT "FK_b49992c69707f661e13ff51d812"`);
        await queryRunner.query(`ALTER TABLE "seed" DROP CONSTRAINT "FK_f42ecc0c12985268fab60f1538e"`);
        await queryRunner.query(`ALTER TABLE "animal" DROP CONSTRAINT "FK_510e4e5132f765d432726830919"`);
        await queryRunner.query(`ALTER TABLE "user_task" DROP CONSTRAINT "FK_be3c9f1acbe21e0070039b5cf79"`);
        await queryRunner.query(`ALTER TABLE "user_task" DROP CONSTRAINT "FK_4df8c371c74decf9ef093358dad"`);
        await queryRunner.query(`ALTER TABLE "bed" DROP CONSTRAINT "FK_b08100365b86e2621c15626f4c3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cb233ded53aaa05c7bab8fa117"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c6c22c0d9d9dcb04d0fa35a883"`);
        await queryRunner.query(`DROP TABLE "product_users_user"`);
        await queryRunner.query(`DROP TABLE "survey"`);
        await queryRunner.query(`DROP TABLE "question"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "inventory"`);
        await queryRunner.query(`DROP TABLE "inventory_slot"`);
        await queryRunner.query(`DROP TABLE "farm_product"`);
        await queryRunner.query(`DROP TYPE "public"."farm_product_category_enum"`);
        await queryRunner.query(`DROP TABLE "animal_product"`);
        await queryRunner.query(`DROP TYPE "public"."animal_product_type_enum"`);
        await queryRunner.query(`DROP TABLE "seed_product"`);
        await queryRunner.query(`DROP TYPE "public"."seed_product_type_enum"`);
        await queryRunner.query(`DROP TABLE "seed"`);
        await queryRunner.query(`DROP TYPE "public"."seed_type_enum"`);
        await queryRunner.query(`DROP TABLE "animal"`);
        await queryRunner.query(`DROP TYPE "public"."animal_type_enum"`);
        await queryRunner.query(`DROP TABLE "user_task"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TABLE "bed"`);
        await queryRunner.query(`DROP TYPE "public"."bed_crop_enum"`);
    }

}

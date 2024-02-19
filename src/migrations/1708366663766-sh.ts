import { MigrationInterface, QueryRunner } from "typeorm";

export class Sh1708366663766 implements MigrationInterface {
    name = 'Sh1708366663766'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_products_product" ("userId" uuid NOT NULL, "productId" uuid NOT NULL, CONSTRAINT "PK_31e9c4932027ab0d5b459b4bbe9" PRIMARY KEY ("userId", "productId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f75a259330a1b34d6c68206b42" ON "user_products_product" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8e92508a7e69cb8011f4bbf9b2" ON "user_products_product" ("productId") `);
        await queryRunner.query(`ALTER TABLE "user_products_product" ADD CONSTRAINT "FK_f75a259330a1b34d6c68206b42f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_products_product" ADD CONSTRAINT "FK_8e92508a7e69cb8011f4bbf9b2e" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_products_product" DROP CONSTRAINT "FK_8e92508a7e69cb8011f4bbf9b2e"`);
        await queryRunner.query(`ALTER TABLE "user_products_product" DROP CONSTRAINT "FK_f75a259330a1b34d6c68206b42f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8e92508a7e69cb8011f4bbf9b2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f75a259330a1b34d6c68206b42"`);
        await queryRunner.query(`DROP TABLE "user_products_product"`);
    }

}

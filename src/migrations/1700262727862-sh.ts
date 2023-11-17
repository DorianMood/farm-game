import { MigrationInterface, QueryRunner } from "typeorm";

export class Sh1700262727862 implements MigrationInterface {
    name = 'Sh1700262727862'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."bed_crop_enum" RENAME TO "bed_crop_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."bed_crop_enum" AS ENUM('Carrot', 'Potato', 'Beet', 'Wheat', 'Flower')`);
        await queryRunner.query(`ALTER TABLE "bed" ALTER COLUMN "crop" TYPE "public"."bed_crop_enum" USING "crop"::"text"::"public"."bed_crop_enum"`);
        await queryRunner.query(`DROP TYPE "public"."bed_crop_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."bed_crop_enum_old" AS ENUM('0', '1', '2', '3', '4')`);
        await queryRunner.query(`ALTER TABLE "bed" ALTER COLUMN "crop" TYPE "public"."bed_crop_enum_old" USING "crop"::"text"::"public"."bed_crop_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."bed_crop_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."bed_crop_enum_old" RENAME TO "bed_crop_enum"`);
    }

}

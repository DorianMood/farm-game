import { MigrationInterface, QueryRunner } from "typeorm";

export class BedsRemoveFieldsAndMakeCropNullable1699795352233 implements MigrationInterface {
    name = 'BedsRemoveFieldsAndMakeCropNullable1699795352233'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bed" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "bed" ALTER COLUMN "crop" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bed" ALTER COLUMN "crop" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bed" ALTER COLUMN "crop" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "bed" ALTER COLUMN "crop" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bed" ADD "content" character varying NOT NULL`);
    }

}

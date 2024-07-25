import { MigrationInterface, QueryRunner } from "typeorm";

export class Sh1721919517649 implements MigrationInterface {
    name = 'Sh1721919517649'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "name" text NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "user" ADD "city" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class Sh1728035168506 implements MigrationInterface {
    name = 'Sh1728035168506'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_character_enum" AS ENUM('Male', 'Female')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "character" "public"."user_character_enum" NOT NULL DEFAULT 'Male'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "character"`);
        await queryRunner.query(`DROP TYPE "public"."user_character_enum"`);
    }

}

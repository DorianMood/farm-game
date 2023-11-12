import { MigrationInterface, QueryRunner } from "typeorm";

export class UserBallance1699795888191 implements MigrationInterface {
    name = 'UserBallance1699795888191'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "ballance" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "ballance"`);
    }

}

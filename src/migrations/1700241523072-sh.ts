import { MigrationInterface, QueryRunner } from "typeorm";

export class Sh1700241523072 implements MigrationInterface {
    name = 'Sh1700241523072'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bed" DROP CONSTRAINT "FK_b08100365b86e2621c15626f4c3"`);
        await queryRunner.query(`ALTER TABLE "bed" ADD CONSTRAINT "FK_b08100365b86e2621c15626f4c3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bed" DROP CONSTRAINT "FK_b08100365b86e2621c15626f4c3"`);
        await queryRunner.query(`ALTER TABLE "bed" ADD CONSTRAINT "FK_b08100365b86e2621c15626f4c3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

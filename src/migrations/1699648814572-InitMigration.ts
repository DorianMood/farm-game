import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1699648814572 implements MigrationInterface {
    name = 'InitMigration1699648814572'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "question" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "question" character varying NOT NULL, "answer" character varying NOT NULL, "surveyId" uuid, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."bed_crop_enum" AS ENUM('0', '1', '2', '3', '4')`);
        await queryRunner.query(`CREATE TABLE "bed" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "index" integer NOT NULL, "plantedAt" TIMESTAMP WITH TIME ZONE, "content" character varying NOT NULL, "crop" "public"."bed_crop_enum" NOT NULL DEFAULT '0', "userId" uuid, CONSTRAINT "PK_828b3f79eab8a8b1de6b6ed6c5a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "completedAt" TIMESTAMP WITH TIME ZONE, "cost" integer NOT NULL, "userId" uuid, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "survey" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "taskId" uuid, CONSTRAINT "PK_f0da32b9181e9c02ecf0be11ed3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "price" integer NOT NULL, "picture" character varying NOT NULL, "content" character varying NOT NULL, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_a1188e0f702ab268e0982049e5c" FOREIGN KEY ("surveyId") REFERENCES "survey"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bed" ADD CONSTRAINT "FK_b08100365b86e2621c15626f4c3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey" ADD CONSTRAINT "FK_f2caadc7f5c1d5dceb1544f3a70" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey" DROP CONSTRAINT "FK_f2caadc7f5c1d5dceb1544f3a70"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9"`);
        await queryRunner.query(`ALTER TABLE "bed" DROP CONSTRAINT "FK_b08100365b86e2621c15626f4c3"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_a1188e0f702ab268e0982049e5c"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "survey"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TABLE "bed"`);
        await queryRunner.query(`DROP TYPE "public"."bed_crop_enum"`);
        await queryRunner.query(`DROP TABLE "question"`);
    }

}

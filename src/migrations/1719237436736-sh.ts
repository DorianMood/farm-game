import { MigrationInterface, QueryRunner } from "typeorm";
import { Product } from "../entities/product";
import { Question } from "../entities/question";
import { Survey } from "../entities/survey";
import { Task, TaskEnum } from "../entities/task";

/**
 * INFO:
 * This a data migration, it will be executed when the database is first created.
 * It doesnt change the database schema but only fill the database with data.
 **/

// INFO: this migration creates products, tasks, questions and surveys

export class Sh1719237436736 implements MigrationInterface {
  name = "Sh1719237436736";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await queryRunner.startTransaction();

    // Tasks
    const taskRepo = queryRunner.manager.getRepository(Task);

    const plantTask = new Task();
    plantTask.type = TaskEnum.Plant;
    plantTask.cost = 1;

    const surveyTask = new Task();
    surveyTask.type = TaskEnum.FinanceGenius;
    surveyTask.cost = 10;

    const gameTask = new Task();
    gameTask.type = TaskEnum.CustomGame;
    gameTask.cost = 100;

    await taskRepo.save([plantTask, surveyTask, gameTask]);

    // Products
    const productRepo = queryRunner.manager.getRepository(Product);

    const products = [];
    for (let i = 0; i < 5; i++) {
      const product = new Product();
      product.name = "промокод " + i;
      product.price = i;
      product.content = "content";
      product.picture = "";
      products.push(product);
    }
    await productRepo.save(products);

    // Questions
    const questions = [];
    for (let i = 0; i < 5; i++) {
      const question = new Question();
      question.question = "question" + i;
      question.answer = "answer" + i;
      questions.push(question);
    }
    // INFO: no need to save questions here, save with relation to survey

    // Survey
    const surveyRepo = queryRunner.manager.getRepository(Survey);
    const survey = new Survey();
    survey.task = surveyTask;
    survey.questions = questions;
    await surveyRepo.save(survey);

    await queryRunner.commitTransaction();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const taskRepo = queryRunner.manager.getRepository(Task);
    await taskRepo.clear();

    const productRepo = queryRunner.manager.getRepository(Product);
    await productRepo.clear();

    const questionRepo = queryRunner.manager.getRepository(Question);
    await questionRepo.clear();

    const surveyRepo = queryRunner.manager.getRepository(Survey);
    await surveyRepo.clear();
  }
}

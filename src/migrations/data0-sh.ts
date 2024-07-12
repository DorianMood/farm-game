import { MigrationInterface, QueryRunner } from "typeorm";

import { Product } from "../entities/product";
import { Question } from "../entities/question";
import { Survey } from "../entities/survey";
import { Task, TaskEnum } from "../entities/task";
import { UserTask } from "../entities/user-task";

export class Sh2000000000000 implements MigrationInterface {
  name = "Sh2000000000000";

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

    const products: Product[] = [];
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
    const questions: Question[] = [];
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
    const userTaskRepo = queryRunner.manager.getRepository(UserTask);
    userTaskRepo.delete({});

    const taskRepo = queryRunner.manager.getRepository(Task);
    await taskRepo.delete({});

    const productRepo = queryRunner.manager.getRepository(Product);
    await productRepo.delete({});

    const questionRepo = queryRunner.manager.getRepository(Question);
    await questionRepo.delete({});

    const surveyRepo = queryRunner.manager.getRepository(Survey);
    await surveyRepo.delete({});
  }
}

import { MigrationInterface, QueryRunner } from "typeorm";
import { Product } from "../entities/product";
import { Question } from "../entities/question";
import { Survey } from "../entities/survey";
import { Task, TaskEnum } from "../entities/task";

export class Sh1710338492274 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.connect();
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

    taskRepo.save([plantTask, surveyTask, gameTask]);

    // Products
    const productRepo = queryRunner.connection.getRepository(Product);

    const products = [];
    for (let i = 0; i < 5; i++) {
      const product = new Product();
      product.name = "product" + i;
      product.price = i;
      product.content = "content";
      product.picture = "";
      products.push(product);
    }
    productRepo.save(products);

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
    const taskRepo = queryRunner.connection.getRepository(Task);
    taskRepo.clear();

    const productRepo = queryRunner.connection.getRepository(Product);
    productRepo.clear();

    const questionRepo = queryRunner.connection.getRepository(Question);
    questionRepo.clear();

    const surveyRepo = queryRunner.connection.getRepository(Survey);
    surveyRepo.clear();
  }
}

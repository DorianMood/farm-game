import { MigrationInterface, QueryRunner } from "typeorm";

import { Question } from "../entities/question";
import { Survey } from "../entities/survey";
import { Task, TaskEnum } from "../entities/task";
import { UserTask } from "../entities/user-task";

const surveys = [
  [
    { question: "Обесценивание денег", answer: "Инфляция" },
    { question: "Иностранные деньги", answer: "Валюта" },
    {
      question: "Когда банк платит проценты от вложенных денег",
      answer: "Валюта",
    },
    { question: "Когда берешь деньги в долг у банка", answer: "Кредит" },
  ],
  [
    { question: "Обесценивание товаров и услуг", answer: "Дефляция" },
    {
      question:
        "Вложение денег на фиксированный срок для получения фиксированного процента",
      answer: "Вклад",
    },
    {
      question: "14 лет",
      answer: "C какого возраста можно оформить банковскую карту в России?",
    },
    { question: "Кредит на покупку жилья", answer: "Ипотека" },
  ],
  [
    { question: "Владельцы акций предприятия", answer: "Акционеры" },
    {
      question:
        "Часть прибыли предприятия, которая распределяется между его акционерами",
      answer: "Дивиденды",
    },
    {
      question: "Вложение денег с целью их преумножения",
      answer: "Инвестиции",
    },
  ],
];

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

    // Questions
    const questions: Question[] = [];
    for (let i = 0; i < surveys[0].length; i++) {
      const question = new Question();
      question.question = surveys[0][i].question;
      question.answer = surveys[0][i].answer;
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

    const questionRepo = queryRunner.manager.getRepository(Question);
    await questionRepo.delete({});

    const surveyRepo = queryRunner.manager.getRepository(Survey);
    await surveyRepo.delete({});
  }
}

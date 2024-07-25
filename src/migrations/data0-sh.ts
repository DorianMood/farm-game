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
      answer: "Депозит",
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
  [
    {
      question:
        "Какое животное является символом молока в мировом сельском хозяйстве?",
      answer: "Корова",
    },
    {
      question:
        "Какой процесс используется для изменения земли так, чтобы она стала пригодной для сельского хозяйства?",
      answer: "Орошение",
    },
    {
      question: "Как называется научное изучение почвы и её удобрений?",
      answer: "Агрономия",
    },
    {
      question: "Какое растение является основным источником пшеницы?",
      answer: "Пшеница",
    },
    {
      question:
        "Какая культура может быть разделена на зерновые и зернобобовые?",
      answer: "Зерновые",
    },
  ],
  [
    {
      question: 'Что такое "депозит" в банковском терминологии?',
      answer: "Деньги, которые клиенты вносят на свои счета в банке",
    },
    {
      question:
        "Какая услуга банка предоставляет возможность клиенту занимать деньги?",
      answer: "Кредитование",
    },
    {
      question:
        "Как называется документ, подтверждающий сделку между банком и клиентом о возврате денег по определённой процентной ставке?",
      answer: "Договор на кредит",
    },
    {
      question:
        "Какой термин используется для обозначения денег, которые банк выделяет для кредитования исходя из размера залога?",
      answer: "Кредитная линия",
    },
    {
      question:
        "Какая организация контролирует деятельность банков в многих странах мира?",
      answer: "Центральный банк",
    },
  ],
  [
    {
      question:
        "Специальный счет, открытый в банке, для хранения и управления деньгами",
      answer: "Банковский счет",
    },
    {
      question:
        "Как называется документ, который показывает все транзакции, проведенные на банковском счете за определенный период времени?",
      answer: "Выписка по счету",
    },
    {
      question:
        "Как называется процесс получения денег в банке или банкомате с использованием специальной карточки?",
      answer: "Снятие наличных",
    },
    {
      question:
        "Как называется документ, подтверждающий право собственности на деньги в банке?",
      answer: "Депозитный сертификат",
    },
    {
      question:
        "Сумма процента, которую банк платит клиенту за то, что тот хранит деньги на депозите",
      answer: "Процентная ставка",
    },
  ],
  [
    {
      question:
        "Какой орган регулирует банковскую систему и финансовые учреждения в большинстве стран?",
      answer: "Центральный банк",
    },
    {
      question:
        "Как называется документ, который клиент подписывает при открытии банковского счета и который содержит условия использования счета и права банка?",
      answer: "Договор банковского счета",
    },
    {
      question:
        "Пластиковая карта, которая позволяет клиенту банка покупать товары и услуги в кредит",
      answer: "Кредитная карта",
    },
    {
      question:
        "Как называется процесс передачи денег с одного банковского счета на другой?",
      answer: "Перевод",
    },
    {
      question:
        "Сервис, предоставляемый банком, который позволяет клиентам управлять своими счетами через интернет",
      answer: "Интернет-банкинг",
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

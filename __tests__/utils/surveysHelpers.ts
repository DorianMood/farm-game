import { AppDataSource } from '../../src/data-source';
import { Survey } from '../../src/entities/survey';
import { Question } from '../../src/entities/question';
import type { Task } from '../../src/entities/task';

interface TestQuestionProps {
  question: string;
  answer: string;
}

/**
 * Create a question in database.
 * @param testQuestion - Question informations.
 * @returns The created question
 */
export const createTestQuestion = async (testQuestion: TestQuestionProps) => {
  const repo = AppDataSource.getRepository(Question);

  const question = new Question();
  question.question = testQuestion.question;
  question.answer = testQuestion.answer;

  await repo.save(question);
  return question;
};

/**
 * Create a survey in database.
 * @param questions - Questions list.
 * @param task - related task informations.
 * @returns The created survey
 */
export const createTestSurvey = async (questions: Question[], task: Task) => {
  const repo = AppDataSource.getRepository(Survey);

  const survey = new Survey();
  survey.task = task;
  survey.questions = questions;

  await repo.save(survey);

  return survey;
};

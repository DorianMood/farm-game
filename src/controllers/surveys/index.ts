import type { Request, Response } from 'express';
import createHttpError from 'http-errors';

import { Survey } from '../../../src/entities/survey';
import { AppDataSource } from '../../../src/data-source';
import { validateSurveysQuery } from './validators';

const retrieve = async (req: Request, res: Response) => {
  if (req.isUnauthenticated()) {
    throw createHttpError(401, 'User is not authentificated');
  }

  const user = req.user;

  if (!user) {
    throw createHttpError(401, 'User is not authentificated');
  }

  const { taskId } = validateSurveysQuery(req.query);

  const surveysRepo = AppDataSource.getRepository(Survey);

  const survey = await surveysRepo.findOne({
    where: {
      task: { id: taskId },
    },
    relations: {
      questions: true,
    },
  });

  return res.json(survey);
};

export default {
  retrieve,
};

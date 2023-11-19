import createHttpError from 'http-errors';
import validator from 'validator';

import type { SurveysQuery } from '../../types/routes/surveys';

export const validateSurveysQuery = (query: Partial<SurveysQuery>) => {
  const { taskId } = query;

  if (taskId === undefined) {
    throw createHttpError(400, 'Task id required');
  }
  if (typeof taskId !== 'string') {
    throw createHttpError(400, 'Task id must be string');
  }
  if (!validator.isUUID(taskId)) {
    throw createHttpError(400, 'Task id must be uuid');
  }

  return query as SurveysQuery;
};

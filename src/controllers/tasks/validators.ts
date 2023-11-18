import createHttpError from 'http-errors';

import type {
  TasksCompleteBody,
  TasksFailBody,
} from '../../types/routes/tasks';

export const validateCompleteBody = (body: Partial<TasksCompleteBody>) => {
  const { id } = body;

  if (id === undefined) {
    throw createHttpError(400, 'Task id required');
  }
  if (typeof id !== 'string') {
    throw createHttpError(400, 'Task id must be string');
  }

  return body as TasksCompleteBody;
};

export const validateFailBody = (body: Partial<TasksFailBody>) => {
  const { id } = body;

  if (id === undefined) {
    throw createHttpError(400, 'Task id required');
  }
  if (typeof id !== 'string') {
    throw createHttpError(400, 'Task id must be string');
  }

  return body as TasksCompleteBody;
};

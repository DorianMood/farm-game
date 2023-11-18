import type { Request, Response } from 'express';
import createHttpError from 'http-errors';

import { AppDataSource } from '../../../src/data-source';
import { UserTask } from '../../../src/entities/user-task';

const retrieve = async (req: Request, res: Response) => {
  if (req.isUnauthenticated()) {
    throw createHttpError(401, 'User is not authentificated');
  }

  const userTasksQueryBuilder =
    AppDataSource.getRepository(UserTask).createQueryBuilder('userTask');

  const userTasks = await userTasksQueryBuilder
    .where('userTask.user = :userId', { userId: req.user?.id })
    .getMany();

  return res.json(userTasks);
};

export default {
  retrieve,
};

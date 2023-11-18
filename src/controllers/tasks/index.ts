import type { Request, Response } from 'express';
import createHttpError from 'http-errors';
import { LessThan, IsNull } from 'typeorm';

import { User } from '../../../src/entities/user';
import { UserTask } from '../../../src/entities/user-task';
import { AppDataSource } from '../../../src/data-source';
import { validateCompleteBody, validateFailBody } from './validators';

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

const complete = async (req: Request, res: Response) => {
  if (req.isUnauthenticated()) {
    throw createHttpError(401, 'User is not authentificated');
  }

  const { id } = validateCompleteBody(req.body);

  // Create a query runner to control the transactions, it allows to cancel the transaction if we need to
  const queryRunner = AppDataSource.createQueryRunner();

  // Connect the query runner to the database and start the transaction
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const user = req.user;

    if (!user) {
      throw createHttpError(401, 'User is not authentificated');
    }

    const userTaskRepo = queryRunner.manager.getRepository(UserTask);

    const userTaskExists = await userTaskRepo.exist({
      where: { id, user: { id: user.id } },
    });

    if (!userTaskExists) {
      throw createHttpError(404, 'User task with given id not found');
    }

    const taskNotCompleted = await userTaskRepo.find({
      where: [
        {
          id,
          user: { id: user.id },
          completedAt: LessThan(new Date(Date.now() - 123).toISOString()),
        },
        {
          id,
          user: { id: user.id },
          completedAt: IsNull(),
        },
      ],
      relations: {
        task: true,
      },
    });

    if (!taskNotCompleted.length) {
      throw createHttpError(409, 'Task is already completed');
    }

    await queryRunner.manager.update(
      UserTask,
      { id, user },
      { completedAt: new Date().toISOString() }
    );

    await queryRunner.manager.update(User, user, {
      ballance: user.ballance + taskNotCompleted[0].task.cost,
    });

    await queryRunner.commitTransaction();

    return res.sendStatus(200);
  } catch (err) {
    // As an exception occured, cancel the transaction
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    // We need to release the query runner to not keep a useless connection to the database
    await queryRunner.release();
  }
};

const fail = async (req: Request, res: Response) => {
  if (req.isUnauthenticated()) {
    throw createHttpError(401, 'User is not authentificated');
  }

  const { id } = validateFailBody(req.body);

  // Create a query runner to control the transactions, it allows to cancel the transaction if we need to
  const queryRunner = AppDataSource.createQueryRunner();

  // Connect the query runner to the database and start the transaction
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const user = req.user;

    if (!user) {
      throw createHttpError(401, 'User is not authentificated');
    }

    const userTaskRepo = queryRunner.manager.getRepository(UserTask);

    const userTaskExists = await userTaskRepo.exist({
      where: { id, user: { id: user.id } },
    });

    if (!userTaskExists) {
      throw createHttpError(404, 'User task with given id not found');
    }

    const taskNotCompleted = await userTaskRepo.find({
      where: [
        {
          id,
          user: { id: user.id },
          completedAt: LessThan(new Date(Date.now() - 123).toISOString()),
        },
        {
          id,
          user: { id: user.id },
          completedAt: IsNull(),
        },
      ],
      relations: {
        task: true,
      },
    });

    if (!taskNotCompleted.length) {
      throw createHttpError(409, 'Task is already completed or failed');
    }

    await queryRunner.manager.update(
      UserTask,
      { id, user },
      { completedAt: new Date().toISOString() }
    );

    await queryRunner.manager.update(User, user, {
      ballance: Math.max(
        0,
        user.ballance - Math.round(taskNotCompleted[0].task.cost / 2)
      ),
    });

    await queryRunner.commitTransaction();

    return res.sendStatus(200);
  } catch (err) {
    // As an exception occured, cancel the transaction
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    // We need to release the query runner to not keep a useless connection to the database
    await queryRunner.release();
  }
};

export default {
  retrieve,
  complete,
  fail,
};

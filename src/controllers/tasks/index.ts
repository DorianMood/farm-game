import type { Request, Response } from "express";
import createHttpError from "http-errors";
import { LessThan, IsNull, Or, Equal, Not } from "typeorm";

import { TaskEnum } from "../../entities/task";

import { TASK_TIMEOUT } from "../../common/constants";
import { UserTask } from "../../entities/user-task";
import { AppDataSource } from "../../data-source";
import { validateCompleteBody, validateFailBody } from "./validators";

const retrieve = async (req: Request, res: Response) => {
  if (req.isUnauthenticated()) {
    throw createHttpError(401, "User is not authentificated");
  }

  const user = req.user;

  if (!user) {
    throw createHttpError(401, "User is not authentificated");
  }

  const userTasksRepo = AppDataSource.getRepository(UserTask);

  const userTasks = await userTasksRepo.find({
    where: {
      user: { id: user.id },
      completedAt: Or(IsNull()),
      task: { type: Not(Equal(TaskEnum.FinanceGenius)) },
    },
    relations: {
      task: true,
    },
  });

  const result = userTasks;

  const hasCompletedSurveyRecently = await userTasksRepo.exist({
    where: {
      user: { id: user.id },
      completedAt: LessThan(new Date(Date.now() - TASK_TIMEOUT).toISOString()),
    },
  });

  if (!hasCompletedSurveyRecently) {
    const userSurveyTask = await userTasksRepo.findOne({
      where: {
        user: { id: user.id },
        completedAt: Or(IsNull()),
        task: { type: Equal(TaskEnum.FinanceGenius) },
      },
      relations: {
        task: true,
      },
    });

    if (userSurveyTask) {
      result.push(userSurveyTask);
    }
  }

  return res.json(result);
};

const complete = async (req: Request, res: Response) => {
  if (req.isUnauthenticated()) {
    throw createHttpError(401, "User is not authentificated");
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
      throw createHttpError(401, "User is not authentificated");
    }

    const userTaskRepo = queryRunner.manager.getRepository(UserTask);

    const userTaskExists = await userTaskRepo.exist({
      where: { id, user: { id: user.id } },
    });

    if (!userTaskExists) {
      throw createHttpError(404, "User task with given id not found");
    }

    const taskNotCompleted = await userTaskRepo.find({
      where: [
        {
          id,
          user: { id: user.id },
          completedAt: LessThan(
            new Date(Date.now() - TASK_TIMEOUT).toISOString(),
          ),
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
      throw createHttpError(409, "Task is already completed");
    }

    await queryRunner.manager.update(
      UserTask,
      { id, user },
      { completedAt: new Date().toISOString() },
    );

    user.ballance += taskNotCompleted[0].task.cost;

    await queryRunner.manager.save(user);

    await queryRunner.commitTransaction();
    // We need to release the query runner to not keep a useless connection to the database
    await queryRunner.release();

    return res.sendStatus(200);
  } catch (err) {
    // As an exception occured, cancel the transaction
    await queryRunner.rollbackTransaction();
    // We need to release the query runner to not keep a useless connection to the database
    await queryRunner.release();
    throw err;
  } finally {
    // We need to release the query runner to not keep a useless connection to the database
    await queryRunner.release();
  }
};

const fail = async (req: Request, res: Response) => {
  if (req.isUnauthenticated()) {
    throw createHttpError(401, "User is not authentificated");
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
      throw createHttpError(401, "User is not authentificated");
    }

    const userTaskRepo = queryRunner.manager.getRepository(UserTask);

    const userTaskExists = await userTaskRepo.exist({
      where: { id, user: { id: user.id } },
    });

    if (!userTaskExists) {
      throw createHttpError(404, "User task with given id not found");
    }

    const taskNotCompleted = await userTaskRepo.find({
      where: [
        {
          id,
          user: { id: user.id },
          completedAt: LessThan(
            new Date(Date.now() - TASK_TIMEOUT).toISOString(),
          ),
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
      throw createHttpError(409, "Task is already completed or failed");
    }

    await queryRunner.manager.update(
      UserTask,
      { id, user },
      { completedAt: new Date().toISOString() },
    );

    user.ballance = Math.max(
      0,
      user.ballance - Math.round(taskNotCompleted[0].task.cost / 2),
    );

    await queryRunner.manager.save(user);

    await queryRunner.commitTransaction();
    // We need to release the query runner to not keep a useless connection to the database
    await queryRunner.release();

    return res.sendStatus(200);
  } catch (err) {
    // As an exception occured, cancel the transaction
    await queryRunner.rollbackTransaction();
    // We need to release the query runner to not keep a useless connection to the database
    await queryRunner.release();
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

import type { Request, Response } from "express";
import createHttpError from "http-errors";

import { AppDataSource } from "../../data-source";

import { User } from "../../entities/user";
import { Bed } from "../../entities/bed";
import { Task } from "../../entities/task";
import { UserTask } from "../../entities/user-task";
import { Inventory } from "../../entities/inventory";

import type { UsersCreateBody } from "../../types/routes/users";
import { validateCreateBody } from "./validators";

const retrieve = async (req: Request, res: Response) => {
  if (req.isUnauthenticated()) {
    throw createHttpError(401, "User is not authentificated");
  }

  const user = req.user;

  if (!user) {
    throw createHttpError(401, "User is not authentificated");
  }

  const queryRunner = AppDataSource.createQueryRunner();

  const userWithProducts = await queryRunner.manager.findOne(User, {
    where: { id: user.id },
    relations: {
      beds: true,
      tasks: true,
    },
  });

  await queryRunner.release();

  return res.json(userWithProducts);
};

const create = async (
  req: TypedRequestBody<UsersCreateBody>,
  res: Response,
) => {
  const { username, email, password } = validateCreateBody(req.body);

  // Create a query runner to control the transactions, it allows to cancel the transaction if we need to
  const queryRunner = AppDataSource.createQueryRunner();

  // Connect the query runner to the database and start the transaction
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const userRepo = queryRunner.manager.getRepository(User);
    const usernameExists = await userRepo.exist({
      where: { username },
    });

    if (usernameExists) {
      throw createHttpError(409, "Username already exists");
    }

    const emailExists = await userRepo.exist({
      where: { email },
    });
    if (emailExists) {
      throw createHttpError(409, "Email already exists");
    }

    const newUser = new User();
    newUser.username = username;
    newUser.email = email;
    newUser.setPassword(password);

    // Assign all available tasks to each user
    const taskRepo = queryRunner.manager.getRepository(Task);
    const tasks = await taskRepo.find();

    const userTaskRepo = queryRunner.manager.getRepository(UserTask);
    const userTasks: UserTask[] = [];
    for (const task of tasks) {
      const userTask = new UserTask();
      userTask.task = task;
      userTask.completedAt = null;
      await userTaskRepo.manager.save(userTask);
      userTasks.push(userTask);
    }
    newUser.tasks = userTasks;

    newUser.ballance = 0;

    // Create 10 beds for each user
    const newBeds: Bed[] = [];
    for (let i = 0; i < 10; i++) {
      const newBed = new Bed();
      newBed.index = i;

      await queryRunner.manager.save(newBed);

      newBeds.push(newBed);
    }
    newUser.beds = newBeds;

    // Create an inventory for new user
    const newInventory = new Inventory();
    newUser.inventory = newInventory;

    await queryRunner.manager.save(newUser);

    // No exceptions occured, so we commit the transaction
    await queryRunner.commitTransaction();
    // We need to release the query runner to not keep a useless connection to the database
    await queryRunner.release();

    return res.send(newUser.id);
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
  create,
  retrieve,
};

import type { Request, Response } from 'express';
import createHttpError from 'http-errors';

import { AppDataSource } from '../../data-source';
import { User } from '../../entities/user';
import { Bed } from '../../entities/bed';
import type { UsersCreateBody } from '../../types/routes/users';
import { validateCreateBody } from './validators';

const retrieve = async (req: Request, res: Response) => {
  if (req.isUnauthenticated()) {
    throw createHttpError(401, 'User is not authentificated');
  }

  const user = req.user;

  if (!user) {
    throw createHttpError(401, 'User is not authentificated');
  }

  const queryRunner = AppDataSource.createQueryRunner();

  const userWithProducts = await queryRunner.manager.findOne(User, {
    where: { id: user.id },
    relations: {
      beds: true,
      products: true,
      tasks: true,
    },
  });

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
      throw createHttpError(409, 'Username already exists');
    }

    const emailExists = await userRepo.exist({
      where: { email },
    });
    if (emailExists) {
      throw createHttpError(409, 'Email already exists');
    }

    const newUser = new User();
    newUser.username = username;
    newUser.email = email;
    newUser.setPassword(password);

    newUser.products = [];
    newUser.tasks = [];

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

    await queryRunner.manager.save(newUser);

    // No exceptions occured, so we commit the transaction
    await queryRunner.commitTransaction();

    res.send(newUser.id);
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
  create,
  retrieve,
};

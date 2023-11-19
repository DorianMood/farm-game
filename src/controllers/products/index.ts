import type { Request, Response } from 'express';
import createHttpError from 'http-errors';

import { AppDataSource } from '../../../src/data-source';
import { validatePurchaseBody } from './validators';

const retrieve = (req: Request, res: Response) => {
  if (req.isUnauthenticated()) {
    throw createHttpError(401, 'User is not authentificated');
  }

  return res.sendStatus(501);
};

const purchase = async (req: Request, res: Response) => {
  if (req.isUnauthenticated()) {
    throw createHttpError(401, 'User is not authentificated');
  }

  validatePurchaseBody(req.body);

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

    // TODO: process purchase here

    await queryRunner.commitTransaction();

    return res.sendStatus(501);
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
  purchase,
};

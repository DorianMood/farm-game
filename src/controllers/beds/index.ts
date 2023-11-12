import type { Request, Response } from 'express';
import { LessThan } from 'typeorm';
import { AppDataSource } from '../../data-source';
import { Bed } from '../../entities/bed';
import { User } from '../../entities/user';
import { validateHarvestBody } from './validators';
import createHttpError from 'http-errors';

const retrieve = async (req: Request, res: Response) => {
  const bedsQueryBuilder =
    AppDataSource.getRepository(Bed).createQueryBuilder('bed');

  const beds = await bedsQueryBuilder
    .where('bed.user = :userId', { userId: req.user?.id })
    .getMany();

  return res.json(beds);
};

const harvest = async (req: Request, res: Response) => {
  const { index } = validateHarvestBody(req.body);

  // Create a query runner to control the transactions, it allows to cancel the transaction if we need to
  const queryRunner = AppDataSource.createQueryRunner();

  // Connect the query runner to the database and start the transaction
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const user = req.user;

    if (!user) {
      throw createHttpError(401, 'User is not authorized');
    }

    const bedRepo = queryRunner.manager.getRepository(Bed);

    const bedExists = await bedRepo.exist({
      where: { index: index, user: { id: user.id } },
    });

    if (!bedExists) {
      throw createHttpError(404, 'Bed with given index not found');
    }

    const bedReady = await bedRepo.exist({
      where: {
        index: index,
        user: { id: user.id },
        plantedAt: LessThan(new Date(Date.now() - 86400000).toISOString()),
      },
    });

    if (!bedReady) {
      throw createHttpError(409, 'Bed is not ready');
    }

    await queryRunner.manager.update(
      Bed,
      { index, user },
      { plantedAt: null, crop: null }
    );

    await queryRunner.manager.update(
      User,
      { id: req.user?.id },
      { ballance: user.ballance + 100 }
    );

    await queryRunner.commitTransaction();

    return res.status(200).send();
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
  harvest,
};

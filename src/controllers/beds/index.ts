import createHttpError from "http-errors";
import type { Request, Response } from "express";
import { IsNull, LessThan } from "typeorm";

import { AppDataSource } from "../../data-source";
import { Bed, CropEnum } from "../../entities/bed";
import {
  BED_GROWING_TIMEOUT,
  BED_PLANT_REWARD,
  BED_HARVEST_REWARD,
} from "../../common/constants";
import { validateHarvestBody, validatePlantBody } from "./validators";

const retrieve = async (req: Request, res: Response) => {
  if (req.isUnauthenticated()) {
    throw createHttpError(401, "User is not authentificated");
  }

  const bedsQueryBuilder =
    AppDataSource.getRepository(Bed).createQueryBuilder("bed");

  const beds = await bedsQueryBuilder
    .where("bed.user = :userId", { userId: req.user?.id })
    .getMany();

  return res.json(beds);
};

const harvest = async (req: Request, res: Response) => {
  if (req.isUnauthenticated()) {
    throw createHttpError(401, "User is not authentificated");
  }

  const { index } = validateHarvestBody(req.body);

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

    const bedRepo = queryRunner.manager.getRepository(Bed);

    const bedExists = await bedRepo.exist({
      where: { index: index, user: { id: user.id } },
    });

    if (!bedExists) {
      throw createHttpError(404, "Bed with given index not found");
    }

    const bedReady = await bedRepo.exist({
      where: {
        index: index,
        user: { id: user.id },
        plantedAt: LessThan(
          new Date(Date.now() - BED_GROWING_TIMEOUT).toISOString(),
        ),
      },
    });

    if (!bedReady) {
      throw createHttpError(409, "Bed is not ready");
    }

    await queryRunner.manager.update(
      Bed,
      { index, user },
      { plantedAt: null, crop: null },
    );

    user.ballance += BED_HARVEST_REWARD;

    await queryRunner.manager.save(user);

    await queryRunner.commitTransaction();
    // We need to release the query runner to not keep a useless connection to the database
    await queryRunner.release();

    return res.status(200).send();
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

const plant = async (req: Request, res: Response) => {
  if (req.isUnauthenticated()) {
    throw createHttpError(401, "User is not authentificated");
  }

  const { index, crop } = validatePlantBody(req.body);

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

    const bedRepo = queryRunner.manager.getRepository(Bed);

    const bedExists = await bedRepo.exist({
      where: { index: index, user: { id: user.id } },
    });

    if (!bedExists) {
      throw createHttpError(404, "Bed with given index not found");
    }

    const bedReady = await bedRepo.exist({
      where: {
        index: index,
        user: { id: user.id },
        crop: IsNull(),
      },
    });

    if (!bedReady) {
      throw createHttpError(409, "Bed is not empty");
    }

    await queryRunner.manager.update(
      Bed,
      { index, user },
      { plantedAt: new Date().toISOString(), crop: CropEnum[crop] },
    );

    user.ballance += BED_PLANT_REWARD;

    await queryRunner.manager.save(user);

    await queryRunner.commitTransaction();

    // We need to release the query runner to not keep a useless connection to the database
    await queryRunner.release();

    return res.status(200).send();
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
  harvest,
  plant,
};

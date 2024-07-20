import createHttpError from "http-errors";
import type { Request, Response } from "express";
import { IsNull, LessThan } from "typeorm";

import { AppDataSource } from "../../data-source";
import { Barn } from "../../entities/barn";
import { Animal } from "../../entities/animal";
import { AnimalEnum } from "../../common/enums";
import { validateHarvestBody, validateStartBody } from "./validators";

const retrieve = async (req: Request, res: Response) => {
  if (req.isUnauthenticated()) {
    throw createHttpError(401, "User is not authentificated");
  }

  // Create a query runner to control the transactions, it allows to cancel the transaction if we need to
  const queryRunner = AppDataSource.createQueryRunner();

  try {
    const user = req.user;

    if (!user) {
      throw createHttpError(401, "User is not authentificated");
    }

    const barnRepo = queryRunner.manager.getRepository(Barn);

    const barns = await barnRepo.find({
      where: {
        user: { id: user.id },
      },
      relations: ["animal"],
    });

    return res.json(barns);
  } catch (err) {
    // As an exception occured, cancel the transaction
    await queryRunner.rollbackTransaction();
    // We need to release the query runner to not keep a useless connection to the database
    await queryRunner.release();
    throw err;
  }
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

    const barnRepo = queryRunner.manager.getRepository(Barn);

    const barn = await barnRepo.findOne({
      where: { index: index, user: { id: user.id } },
      relations: ["animal"],
    });

    if (!barn) {
      throw createHttpError(404, "Barn with given index not found");
    }

    const { animal } = barn;

    if (!animal) {
      throw createHttpError(404, "Animal is not found");
    }

    const barnReady = await barnRepo.exist({
      where: {
        index: index,
        user: { id: user.id },
        startedAt: LessThan(
          new Date(Date.now() - animal.harvestTimeout).toISOString(),
        ),
      },
    });

    if (!barnReady) {
      throw createHttpError(409, "Barn is not ready");
    }

    await queryRunner.manager.update(
      Barn,
      { index, user },
      { startedAt: null, animal: null },
    );

    // TODO: add resource to inventory
    user.ballance += animal.inventoryItem.price;

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

const start = async (req: Request, res: Response) => {
  if (req.isUnauthenticated()) {
    throw createHttpError(401, "User is not authentificated");
  }

  const { index, animal } = validateStartBody(req.body);

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

    const barnRepo = queryRunner.manager.getRepository(Barn);
    const animalRepo = queryRunner.manager.getRepository(Animal);

    const barnExists = await barnRepo.exist({
      where: { index: index, user: { id: user.id } },
    });

    if (!barnExists) {
      throw createHttpError(404, "Barn with given index not found");
    }

    const barnReady = await barnRepo.exist({
      where: {
        index: index,
        user: { id: user.id },
        animal: IsNull(),
      },
    });

    if (!barnReady) {
      throw createHttpError(409, "Barn is not empty");
    }

    const pet = await animalRepo.findOneBy({
      type: AnimalEnum[animal],
    });

    await queryRunner.manager.update(
      Barn,
      { index, user },
      { startedAt: new Date().toISOString(), animal: pet },
    );

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
  start,
};

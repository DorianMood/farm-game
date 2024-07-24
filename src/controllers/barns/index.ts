import createHttpError from "http-errors";
import type { Request, Response } from "express";
import { In, LessThan } from "typeorm";

import { AppDataSource } from "../../data-source";
import { Barn } from "../../entities/barn";
import { Animal } from "../../entities/animal";
import { AnimalProduct } from "../../entities/animal-product";
import { Inventory } from "../../entities/inventory";
import { InventorySlot } from "../../entities/inventory-slot";
import { validateHarvestBody } from "./validators";

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

    // We need to release the query runner to not keep a useless connection to the database
    await queryRunner.release();

    return res.json(barns);
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

const harvest = async (req: Request, res: Response) => {
  if (req.isUnauthenticated()) {
    throw createHttpError(401, "User is not authentificated");
  }

  const { animal: animalType } = validateHarvestBody(req.body);

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
    const inventoryRepo = queryRunner.manager.getRepository(Inventory);
    const animalProductRepo = queryRunner.manager.getRepository(AnimalProduct);

    const barn = await barnRepo.findOne({
      where: { user: { id: user.id }, animal: { type: animalType } },
      relations: ["animal"],
    });

    if (!barn) {
      throw createHttpError(404, "Barn with given animal not found");
    }

    const { animal: pet } = barn;

    if (!pet) {
      throw createHttpError(404, "Animal is not found");
    }

    const barnReady = await barnRepo.exist({
      where: {
        animal: { type: animalType },
        user: { id: user.id },
        startedAt: LessThan(
          new Date(Date.now() - pet.harvestTimeout).toISOString(),
        ),
      },
    });

    if (!barnReady) {
      throw createHttpError(409, "Barn is not ready");
    }

    const animal = await animalRepo.findOne({
      where: { id: pet.id },
      relations: ["inventoryItem", "animalProducts"],
    });

    if (!animal) {
      throw createHttpError(404, "No such animal found");
    }

    // INFO: reset timer
    await queryRunner.manager.update(
      Barn,
      { id: barn.id },
      { startedAt: new Date().toISOString() },
    );

    // INFO: add resource to the inventory
    const inventory = await inventoryRepo.findOne({
      where: { user: { id: user.id } },
      relations: {
        items: {
          inventoryItem: {
            animalProduct: true,
          },
        },
      },
    });

    if (!inventory) {
      throw createHttpError(409, "No inventory found");
    }

    const harvestProducts = await animalProductRepo.find({
      where: {
        id: In(animal.animalProducts.map((item) => item.id)),
      },
      relations: {
        inventoryItem: true,
      },
    });

    for (const product of harvestProducts) {
      const slotIndex = inventory.items.findIndex(
        (item) => item.inventoryItem.animalProduct?.type === product.type,
      );

      if (slotIndex === -1) {
        // INFO: no inventory slot found, add a new one
        const inventorySlot = new InventorySlot();

        inventorySlot.amount = 1;
        inventorySlot.inventoryItem = product.inventoryItem;
        await queryRunner.manager.save(inventorySlot);

        inventory.items.push(inventorySlot);
      } else {
        // INFO: otherwise increment slot amount value
        inventory.items[slotIndex].amount += 1;
      }
    }

    await queryRunner.manager.save(inventory);

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
};

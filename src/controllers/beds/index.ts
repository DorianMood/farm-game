import createHttpError from "http-errors";
import type { Request, Response } from "express";
import { In, IsNull, LessThan } from "typeorm";

import { AppDataSource } from "../../data-source";
import { Bed } from "../../entities/bed";
import { Seed } from "../../entities/seed";
import { Inventory } from "../../entities/inventory";
import { InventorySlot } from "../../entities/inventory-slot";
import { SeedProduct } from "../../entities/seed-product";
import { SeedEnum } from "../../common/enums";
import { validateHarvestBody, validatePlantBody } from "./validators";

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

    const bedRepo = queryRunner.manager.getRepository(Bed);

    const beds = await bedRepo.find({
      where: {
        user: { id: user.id },
      },
      relations: ["crop"],
    });

    return res.json(beds);
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

    const bedRepo = queryRunner.manager.getRepository(Bed);
    const seedRepo = queryRunner.manager.getRepository(Seed);
    const inventoryRepo = queryRunner.manager.getRepository(Inventory);
    const seedProductRepo = queryRunner.manager.getRepository(SeedProduct);

    const bed = await bedRepo.findOne({
      where: { index: index, user: { id: user.id } },
      relations: ["crop"],
    });

    if (!bed) {
      throw createHttpError(404, "Bed with given index not found");
    }

    const { crop } = bed;

    if (!crop) {
      throw createHttpError(404, "Crop for bed not found");
    }

    const bedReady = await bedRepo.exist({
      where: {
        index: index,
        user: { id: user.id },
        plantedAt: LessThan(
          new Date(Date.now() - crop.harvestTimeout).toISOString(),
        ),
      },
    });

    if (!bedReady) {
      throw createHttpError(409, "Bed is not ready");
    }

    const seed = await seedRepo.findOne({
      where: {
        type: crop.type,
      },
      relations: {
        inventoryItem: true,
        seedProducts: true,
      },
    });

    if (!seed) {
      throw createHttpError(409, "No such seed found");
    }

    await queryRunner.manager.update(
      Bed,
      { index, user },
      { plantedAt: null, crop: null },
    );

    // INFO: add resource to the inventory
    const inventory = await inventoryRepo.findOne({
      where: { user: { id: user.id } },
      relations: {
        items: {
          inventoryItem: {
            seedProduct: true,
          },
        },
      },
    });

    if (!inventory) {
      throw createHttpError(409, "No inventory found");
    }

    const harvestProducts = await seedProductRepo.find({
      where: {
        id: In(seed.seedProducts.map((item) => item.id)),
      },
      relations: {
        inventoryItem: true,
      },
    });

    for (const product of harvestProducts) {
      const slotIndex = inventory.items.findIndex(
        (item) => item.inventoryItem.seedProduct?.type === product.type,
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
    const seedRepo = queryRunner.manager.getRepository(Seed);
    const inventoryRepo = queryRunner.manager.getRepository(Inventory);

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

    const seed = await seedRepo.findOne({
      where: {
        type: SeedEnum[crop],
      },
      relations: ["inventoryItem"],
    });

    if (!seed) {
      throw createHttpError(404, "No such seed found");
    }

    const inventory = await inventoryRepo.findOne({
      where: { user: { id: user.id } },
      relations: {
        items: { inventoryItem: true },
      },
    });

    if (!inventory) {
      throw createHttpError(404, "No inventory found");
    }

    const slots = inventory.items;

    const seedSlotIndex = slots.findIndex(
      (slot) => slot.inventoryItem.seed?.id === seed.id,
    );

    if (seedSlotIndex === -1) {
      throw createHttpError(404, "No seed slot found");
    }

    if (slots[seedSlotIndex].amount > 1) {
      // INFO: decrement this slot
      slots[seedSlotIndex].amount -= 1;
      await queryRunner.manager.save(slots[seedSlotIndex]);
    } else {
      // INFO: remove this slot
      await queryRunner.manager.delete(InventorySlot, {
        id: slots[seedSlotIndex].id,
      });
    }

    await queryRunner.manager.update(
      Bed,
      { index, user },
      { plantedAt: new Date().toISOString(), crop: seed },
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
  plant,
};

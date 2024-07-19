import type { Request, Response } from "express";
import createHttpError from "http-errors";

import { LessThanOrEqual } from "typeorm";

import { type RetrieveProductsQuery } from "../../types/routes/products";

import { AppDataSource } from "../../data-source";
import { InventoryItem } from "../../entities/inventory-item";
import { InventorySlot } from "../../entities/inventory-slot";
import { Inventory } from "../../entities/inventory";
import { validatePurchaseBody, validateSellBody } from "./validators";

const retrieve = async (
  req: Request<unknown, unknown, unknown, RetrieveProductsQuery>,
  res: Response,
) => {
  const user = req.user;

  if (!user) {
    throw createHttpError(401, "User is not authentificated");
  }

  const inventoryItemsRepository = AppDataSource.getRepository(InventoryItem);

  const allInventoryItems = await inventoryItemsRepository.find({
    loadEagerRelations: true,
  });

  return res.json({ items: allInventoryItems });
};

const purchase = async (req: Request, res: Response) => {
  if (req.isUnauthenticated()) {
    throw createHttpError(401, "User is not authentificated");
  }

  const { id } = validatePurchaseBody(req.body);

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

    const inventoryRepo = queryRunner.manager.getRepository(Inventory);
    const inventoryItemRepo = queryRunner.manager.getRepository(InventoryItem);

    const inventoryItemToPurchase = await inventoryItemRepo.findOne({
      where: { id: id },
      loadEagerRelations: true,
    });

    if (!inventoryItemToPurchase) {
      throw createHttpError(404, "Inventory item with given id is not found");
    }

    const inventoryItemAvailableForPurchase = await inventoryItemRepo.findOneBy(
      {
        id,
        price: LessThanOrEqual(user.ballance),
      },
    );

    if (!inventoryItemAvailableForPurchase) {
      throw createHttpError(400, "Insufficient ballance");
    }

    // INFO: write off money
    user.ballance -= inventoryItemAvailableForPurchase.price;

    // INFO: add item to inventory
    const inventory = await inventoryRepo.findOne({
      where: { user: { id: user.id } },
      relations: {
        items: {
          inventoryItem: true,
        },
      },
    });

    if (!inventory) {
      throw createHttpError(404, "Inventory not found");
    }

    const inventorySlotIndex = inventory.items.findIndex(
      (item) => item.inventoryItem.id === id,
    );

    if (inventorySlotIndex === -1) {
      const inventorySlot = new InventorySlot();

      inventorySlot.amount = 1;
      inventorySlot.inventoryItem = inventoryItemAvailableForPurchase;
      await queryRunner.manager.save(inventorySlot);

      inventory.items.push(inventorySlot);
    } else {
      inventory.items[inventorySlotIndex].amount += 1;
    }

    await queryRunner.manager.save(user);
    await queryRunner.manager.save(inventory);

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

const sell = async (req: Request, res: Response) => {
  if (req.isUnauthenticated()) {
    throw createHttpError(401, "User is not authentificated");
  }

  const { id, amount } = validateSellBody(req.body);

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

    // const inventoryRepo = queryRunner.manager.getRepository(Inventory);
    // const inventoryItemRepo = queryRunner.manager.getRepository(InventoryItem);
    const inventorySlotRepo = queryRunner.manager.getRepository(InventorySlot);

    const inventorySlotToSell = await inventorySlotRepo.findOne({
      where: { id: id },
      relations: ["inventoryItem"],
      loadEagerRelations: true,
    });

    if (!inventorySlotToSell) {
      throw createHttpError(404, "Inventory slot with given id is not found");
    }

    if (amount > inventorySlotToSell.amount) {
      throw createHttpError(
        400,
        "Inventory slot has less items than given amount",
      );
    }

    if (inventorySlotToSell.amount === amount) {
      await queryRunner.manager.remove(inventorySlotToSell);
    } else {
      inventorySlotToSell.amount -= 1;
      await queryRunner.manager.save(inventorySlotToSell);
    }

    // INFO: top up money
    user.ballance += inventorySlotToSell.inventoryItem.price * amount;

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
  purchase,
  sell,
};

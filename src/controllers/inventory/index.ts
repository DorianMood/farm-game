import createHttpError from "http-errors";
import type { Request, Response } from "express";

import { AppDataSource } from "../../data-source";
import { User } from "../../entities/user";
import { Inventory } from "../../entities/inventory";

const retrieve = async (req: Request, res: Response) => {
  if (req.isUnauthenticated()) {
    throw createHttpError(401, "User is not authentificated");
  }

  const user = req.user;

  if (!user) {
    throw createHttpError(401, "User is not authentificated");
  }

  const queryRunner = AppDataSource.createQueryRunner();

  const userWithInventory = await queryRunner.manager.findOne(User, {
    where: { id: user.id },
    relations: {
      inventory: true,
    },
  });

  const inventory = await queryRunner.manager.findOne(Inventory, {
    where: { id: userWithInventory!.inventory.id },
    relations: {
      items: {
        inventoryItem: true,
      },
    },
  });

  if (!inventory) {
    throw createHttpError(401, "User is not authentificated");
  }

  await queryRunner.release();

  return res.json({
    ...inventory,
    deletedAt: undefined,
    createdAt: undefined,
    updatedAt: undefined,
  });
};

export default {
  retrieve,
};

import createHttpError from "http-errors";
import { IsNull, Not } from "typeorm";
import type { Request, Response } from "express";

import { InventoryItemCategoryEnum } from "../../common/enums";

import { AppDataSource } from "../../data-source";
import { User } from "../../entities/user";
import { Inventory } from "../../entities/inventory";
import { InventorySlot } from "../../entities/inventory-slot";
import { Bed } from "../../entities/bed";
import { Barn } from "../../entities/barn";

import { validateApplyBody } from "./validators";

const retrieve = async (req: Request, res: Response) => {
  if (req.isUnauthenticated()) {
    throw createHttpError(401, "User is not authentificated");
  }

  const user = req.user;

  if (!user) {
    throw createHttpError(401, "User is not authentificated");
  }

  const queryRunner = AppDataSource.createQueryRunner();

  try {
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
  } finally {
    // We need to release the query runner to not keep a useless connection to the database
    await queryRunner.release();
  }
};

const activate = async (req: Request, res: Response) => {
  if (req.isUnauthenticated()) {
    throw createHttpError(401, "User is not authentificated");
  }

  const user = req.user;

  if (!user) {
    throw createHttpError(401, "User is not authentificated");
  }

  const { id: slotId } = validateApplyBody(req.body);

  const queryRunner = AppDataSource.createQueryRunner();

  const inventorySlotRepo = queryRunner.manager.getRepository(InventorySlot);

  try {
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

    const inventorySlotToActivate = await inventorySlotRepo.findOne({
      where: { id: slotId, inventory: { id: inventory.id } },
      relations: ["inventoryItem"],
      loadEagerRelations: true,
    });

    if (!inventorySlotToActivate) {
      throw createHttpError(400, "Not found inventory slot with given id");
    }

    switch (inventorySlotToActivate.inventoryItem.category) {
      case InventoryItemCategoryEnum.Fertilizer: {
        // INFO: activate inventory slot
        const bedRepo = queryRunner.manager.getRepository(Bed);

        const beds = await bedRepo.find({
          where: {
            user: { id: user.id },
            plantedAt: Not(IsNull()),
          },
          relations: ["crop"],
        });

        const now = Date.now();

        const maxPeriod = beds.reduce((max, bed) => {
          const harvestTime =
            new Date(bed.plantedAt!).getTime() +
            (bed.crop?.harvestTimeout ?? 0);

          const remindingTime = harvestTime - now;

          if (remindingTime > max) {
            return remindingTime;
          }

          return max;
        }, 0);

        if (maxPeriod <= 0) {
          throw createHttpError(400, "Cannot apply fertilizer, all beds ready");
        }

        for (let i = 0; i < beds.length; i++) {
          beds[i].plantedAt = new Date(
            new Date(beds[i].plantedAt!).getTime() - maxPeriod,
          ).toISOString();
        }

        await queryRunner.manager.save(beds);

        // INFO: remove or decrement inventory slot
        if (inventorySlotToActivate.amount === 1) {
          await queryRunner.manager.remove(inventorySlotToActivate);
        } else {
          inventorySlotToActivate.amount -= 1;
          await queryRunner.manager.save(inventorySlotToActivate);
        }
        break;
      }
      case InventoryItemCategoryEnum.Vitamin: {
        // INFO: activate inventory slot
        const barnRepo = queryRunner.manager.getRepository(Barn);

        const barns = await barnRepo.find({
          where: {
            user: { id: user.id },
            startedAt: Not(IsNull()),
          },
          relations: ["animal"],
        });

        const now = Date.now();

        const maxPeriod = barns.reduce((max, barn) => {
          const harvestTime =
            new Date(barn.startedAt!).getTime() +
            (barn.animal?.harvestTimeout ?? 0);

          const remindingTime = harvestTime - now;

          if (remindingTime > max) {
            return remindingTime;
          }

          return max;
        }, 0);

        if (maxPeriod <= 0) {
          throw createHttpError(400, "Cannot apply vitamin, all barns ready");
        }

        for (let i = 0; i < barns.length; i++) {
          barns[i].startedAt = new Date(
            new Date(barns[i].startedAt!).getTime() - maxPeriod,
          ).toISOString();
        }

        await queryRunner.manager.save(barns);
        // INFO: remove or decrement inventory slot
        if (inventorySlotToActivate.amount === 1) {
          await queryRunner.manager.remove(inventorySlotToActivate);
        } else {
          inventorySlotToActivate.amount -= 1;
          await queryRunner.manager.save(inventorySlotToActivate);
        }
        break;
      }
      default:
        await queryRunner.release();
        throw createHttpError(400, "Not a fertilizer or vitamin");
    }

    await queryRunner.release();

    return res.sendStatus(200);
  } finally {
    // We need to release the query runner to not keep a useless connection to the database
    await queryRunner.release();
  }
};

export default {
  retrieve,
  activate,
};

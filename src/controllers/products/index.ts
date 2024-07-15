import type { Request, Response } from "express";
import createHttpError from "http-errors";

import { LessThanOrEqual } from "typeorm";

import {
  // RetrieveProductsFilterEnum,
  type RetrieveProductsQuery,
} from "../../types/routes/products";

import { AppDataSource } from "../../data-source";
import { Product } from "../../entities/product";
import { validatePurchaseBody } from "./validators";
import { InventoryItem } from "../..//entities/inventory-item";

const retrieve = async (
  req: Request<unknown, unknown, unknown, RetrieveProductsQuery>,
  res: Response,
) => {
  const user = req.user;

  if (!user) {
    throw createHttpError(401, "User is not authentificated");
  }

  // all, available, mine
  // const { filter } = req.query;

  // const productsRepository = AppDataSource.getRepository(Product);
  const inventoryItemsRepository = AppDataSource.getRepository(InventoryItem);

  const allInventoryItems = await inventoryItemsRepository.find({
    loadEagerRelations: true,
  });

  return res.json(allInventoryItems);

  // switch (filter) {
  //   case RetrieveProductsFilterEnum.available: {
  //     // Select products available for purchase
  //     const availableProducts = await productsRepository.find({
  //       where: {
  //         price: LessThanOrEqual(user.ballance),
  //         users: Not(user),
  //       },
  //     });
  //
  //     // productsRepository.find({
  //     //   join: {
  //     //     alias: "users",
  //     //   },
  //     //   where: (db) => db.where("users.id = :id", { id: user.id }),
  //     // });
  //
  //     productsRepository
  //       .createQueryBuilder("product")
  //       .where("product.price <= :price", { price: user.ballance })
  //       .andWhere("product.users NOT LIKE :id", { id: user.id });
  //
  //     return res.json(availableProducts);
  //   }
  //   case RetrieveProductsFilterEnum.mine: {
  //     // Select purchased products
  //     // const purchasedProducts = await productsRepository.find({
  //     //   where: {
  //     //     users: user,
  //     //   },
  //     // });
  //     break;
  //   }
  //   case RetrieveProductsFilterEnum.all: {
  //     // Select all products
  //     await productsRepository.find();
  //     break;
  //   }
  //   default: {
  //     // Select all products
  //     // await productsRepository.queryRunner
  //     break;
  //   }
  // }
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

    const productRepo = queryRunner.manager.getRepository(Product);

    const product = await productRepo.findOne({
      where: {
        id,
      },
    });

    if (!product) {
      createHttpError(404, "Product with given id is not found");
    }

    const productAvailableForPurchase = await productRepo.findOneBy({
      id,
      price: LessThanOrEqual(user.ballance),
    });

    if (!productAvailableForPurchase) {
      throw createHttpError(400, "Insufficient ballance");
    }

    user.ballance -= productAvailableForPurchase.price;

    if (Array.isArray(user.products)) {
      user.products.push(productAvailableForPurchase);
    } else {
      user.products = [productAvailableForPurchase];
    }

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
};

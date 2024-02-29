import type { Request, Response } from "express";
import createHttpError from "http-errors";

import { LessThanOrEqual } from "typeorm";

import { AppDataSource } from "../../data-source";
import { Product } from "../../entities/product";
import { validatePurchaseBody } from "./validators";

const retrieve = async (req: Request, res: Response) => {
  if (req.isUnauthenticated()) {
    throw createHttpError(401, "User is not authentificated");
  }

  const productsQueryBuilder =
    AppDataSource.getRepository(Product).createQueryBuilder("product");

  const products = await productsQueryBuilder.getMany();

  return res.json(products);
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

    return res.sendStatus(200);
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

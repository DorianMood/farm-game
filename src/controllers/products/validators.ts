import createHttpError from "http-errors";
import validator from "validator";

import type {
  ProductsPurchaseBody,
  ProductsSellBody,
} from "../../types/routes/products";

export const validatePurchaseBody = (body: Partial<ProductsPurchaseBody>) => {
  const { id } = body;

  if (id === undefined) {
    throw createHttpError(400, "Product id required");
  }
  if (typeof id !== "string") {
    throw createHttpError(400, "Product id must be string");
  }
  if (!validator.isUUID(id)) {
    throw createHttpError(400, "Product id must be uuid");
  }

  return body as ProductsPurchaseBody;
};

export const validateSellBody = (body: Partial<ProductsSellBody>) => {
  const { id, amount } = body;

  if (id === undefined) {
    throw createHttpError(400, "Inventory slot id required");
  }
  if (typeof id !== "string") {
    throw createHttpError(400, "Inventory slot id must be string");
  }
  if (!validator.isUUID(id)) {
    throw createHttpError(400, "Inventory slot id must be uuid");
  }

  if (amount) {
    if (typeof amount !== "number") {
      throw createHttpError(400, "Amount must be number");
    }
    if (amount <= 0) {
      throw createHttpError(400, "Amount must be positive");
    }
  } else {
    body.amount = 1;
  }

  return body as ProductsSellBody;
};

import createHttpError from "http-errors";
import validator from "validator";

import type { ProductsPurchaseBody } from "../../types/routes/products";

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

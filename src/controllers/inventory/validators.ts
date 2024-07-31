import createHttpError from "http-errors";
import validator from "validator";

import type { InventoryApplyBody } from "../../types/routes/inventory";

export const validateApplyBody = (body: Partial<InventoryApplyBody>) => {
  const { id } = body;

  if (id === undefined) {
    throw createHttpError(400, "Inventory slot id required");
  }
  if (typeof id !== "string") {
    throw createHttpError(400, "Inventory slot id must be string");
  }
  if (!validator.isUUID(id)) {
    throw createHttpError(400, "Inventory slot id must be uuid");
  }

  return body as InventoryApplyBody;
};

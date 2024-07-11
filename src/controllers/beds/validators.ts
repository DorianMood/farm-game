import createHttpError from "http-errors";

import type { BedsHarvestBody, BedsPlantBody } from "../../types/routes/beds";
import { CropEnum } from "../../common/enums";

export const validateHarvestBody = (body: Partial<BedsHarvestBody>) => {
  const { index } = body;

  if (index === undefined) {
    throw createHttpError(400, "Bed index required");
  }
  if (!Number.isInteger(index)) {
    throw createHttpError(400, "Bed index must be integer");
  }

  return body as BedsHarvestBody;
};

export const validatePlantBody = (body: Partial<BedsPlantBody>) => {
  const { index, crop } = body;

  if (index === undefined) {
    throw createHttpError(400, "Bed index required");
  }
  if (!Number.isInteger(index)) {
    throw createHttpError(400, "Bed index must be integer");
  }

  if (crop === undefined) {
    throw createHttpError(400, "Crop required");
  }
  if (!(crop in CropEnum)) {
    throw createHttpError(400, `Crop must be in enum ${CropEnum}`);
  }

  return body as BedsPlantBody;
};

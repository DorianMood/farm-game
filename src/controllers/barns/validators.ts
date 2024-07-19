import createHttpError from "http-errors";

import type {
  BarnsHarvestBody,
  BarnsStartBody,
} from "../../types/routes/barns";
import { AnimalEnum } from "../../common/enums";

export const validateHarvestBody = (body: Partial<BarnsHarvestBody>) => {
  const { index } = body;

  if (index === undefined) {
    throw createHttpError(400, "Barn index required");
  }
  if (!Number.isInteger(index)) {
    throw createHttpError(400, "Barn index must be integer");
  }

  return body as BarnsHarvestBody;
};

export const validateStartBody = (body: Partial<BarnsStartBody>) => {
  const { index, animal } = body;

  if (index === undefined) {
    throw createHttpError(400, "Barn index required");
  }
  if (!Number.isInteger(index)) {
    throw createHttpError(400, "Barn index must be integer");
  }

  if (animal === undefined) {
    throw createHttpError(400, "Animal required");
  }
  if (!(animal in AnimalEnum)) {
    throw createHttpError(400, `Animal must be in enum ${AnimalEnum}`);
  }

  return body as BarnsStartBody;
};

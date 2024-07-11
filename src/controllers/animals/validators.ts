import createHttpError from "http-errors";

import type {
  AnimalsHarvestBody,
  AnimalsStartBody,
} from "../../types/routes/animals";
import { PetEnum } from "../../common/enums";

export const validateHarvestBody = (body: Partial<AnimalsHarvestBody>) => {
  const { index } = body;

  if (index === undefined) {
    throw createHttpError(400, "Barn index required");
  }
  if (!Number.isInteger(index)) {
    throw createHttpError(400, "Barn index must be integer");
  }

  return body as AnimalsHarvestBody;
};

export const validateStartBody = (body: Partial<AnimalsStartBody>) => {
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
  if (!(animal in PetEnum)) {
    throw createHttpError(400, `Animal must be in enum ${PetEnum}`);
  }

  return body as AnimalsStartBody;
};

import createHttpError from "http-errors";

import type { BarnsHarvestBody } from "../../types/routes/barns";
import { AnimalEnum } from "../../common/enums";

export const validateHarvestBody = (body: Partial<BarnsHarvestBody>) => {
  const { animal } = body;

  if (animal === undefined) {
    throw createHttpError(400, "Animal required");
  }
  if (!(animal in AnimalEnum)) {
    throw createHttpError(
      400,
      `Animal must be in enum [${Object.values(AnimalEnum)}]`,
    );
  }

  return body as BarnsHarvestBody;
};

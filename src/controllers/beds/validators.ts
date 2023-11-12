import createHttpError from 'http-errors';

import type { BedsHarvestBody } from '../../types/routes/beds';

export const validateHarvestBody = (body: Partial<BedsHarvestBody>) => {
  const { index } = body;

  if (index === undefined) {
    throw createHttpError(400, 'Bed index required');
  }
  if (!Number.isInteger(index)) {
    throw createHttpError(400, 'Bed index must be integer');
  }

  return body as BedsHarvestBody;
};

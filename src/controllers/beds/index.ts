import type { Request, Response } from 'express';
import { AppDataSource } from '../../data-source';
import { Bed } from '../../entities/bed';

const retrieve = async (req: Request, res: Response) => {
  const bedsQuesryBuilder =
    AppDataSource.getRepository(Bed).createQueryBuilder('bed');

  const beds = await bedsQuesryBuilder.getMany();

  return res.json(beds);
};

export default {
  retrieve,
};

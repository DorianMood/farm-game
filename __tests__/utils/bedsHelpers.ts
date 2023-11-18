import { AppDataSource } from '../../src/data-source';
import { Bed } from '../../src/entities/bed';
import { User } from '../../src/entities/user';

/**
 * Create 10 beds for each user.
 * @param user - User.
 * @returns The created beds list
 */
export const createBeds = async (user: User) => {
  const userRepo = AppDataSource.getRepository(User);
  const bedsRepo = AppDataSource.getRepository(Bed);

  const newBeds: Bed[] = [];
  for (let i = 0; i < 10; i++) {
    const newBed = new Bed();
    newBed.index = i;

    await bedsRepo.save(newBed);

    newBeds.push(newBed);
  }
  user.beds = newBeds;

  await userRepo.save(user);

  return newBeds;
};

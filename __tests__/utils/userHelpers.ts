import { AppDataSource } from '../../src/data-source';
import { User } from '../../src/entities/user';
import { Bed } from '../../src/entities/bed';

export interface TestUserProps {
  username?: string;
  email?: string;
  password?: string;
}

/**
 * Create a user in database.
 * @param testUser - User informations. Optional.
 * @returns The created user
 */
export const createTestUser = async (testUser?: TestUserProps) => {
  const userRepo = AppDataSource.getRepository(User);
  const bedsRepo = AppDataSource.getRepository(Bed);

  const user = new User();
  user.username = testUser?.username || 'testUser';
  user.email = testUser?.email || 'testUser@gmail.com';
  user.setPassword(testUser?.password || 'password');

  // Create 10 beds for each user
  const newBeds: Bed[] = [];
  for (let i = 0; i < 10; i++) {
    const newBed = new Bed();
    newBed.index = i;

    await bedsRepo.save(newBed);

    newBeds.push(newBed);
  }
  user.beds = newBeds;

  await userRepo.save(user);
  return user;
};

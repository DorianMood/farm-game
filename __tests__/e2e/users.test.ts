import type { Server } from 'http';
import request from 'supertest';

import { AppDataSource } from '../../src/data-source';
import { User } from '../../src/entities/user';
import type { Bed } from '../../src/entities/bed';
import type { Task } from '../../src/entities/task';
import {
  clearDatabase,
  closeDatabase,
  createAuthenticatedAgent,
  createTestServer,
} from '../utils/testsHelpers';
import { createTestUser } from '../utils/userHelpers';

let server: Server;

beforeAll(async () => {
  server = await createTestServer();
});

afterAll(async () => {
  await closeDatabase();
  server.close();
});

describe('Users routes', () => {
  afterEach(async () => {
    await clearDatabase();
  });

  test('Create a user', async () => {
    const username = 'fakeUser';
    const email = 'fakeUser@gmail.com';
    const password = 'fakeUserPwd';

    const res = await request(server)
      .post('/api/users')
      .send({ username, email, password });

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneByOrFail({ username });

    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual(user.id);
  });

  test('User creation fails if query body is invalid', async () => {
    const username = 'fakeUser';
    const email = 'fakeUser@gmail.com';
    const password = 'fakeUserPwd';

    // Missing username
    const res1 = await request(server)
      .post('/api/users')
      .send({ email, password });

    expect(res1.statusCode).toEqual(400);
    expect(res1.body.message).toEqual('Username required');

    // Missing email
    const res2 = await request(server)
      .post('/api/users')
      .send({ username, password });

    expect(res2.statusCode).toEqual(400);
    expect(res2.body.message).toEqual('Email required');

    // Missing password
    const res3 = await request(server)
      .post('/api/users')
      .send({ username, email });

    expect(res3.statusCode).toEqual(400);
    expect(res3.body.message).toEqual('Password required');

    // Username have less that 5 characters
    const res4 = await request(server)
      .post('/api/users')
      .send({ username: 'fake', email, password });

    expect(res4.statusCode).toEqual(400);
    expect(res4.body.message).toEqual(
      'Username must contain at least 5 characters',
    );

    // Email is invalid
    const res5 = await request(server)
      .post('/api/users')
      .send({ username, email: 'fake', password });

    expect(res5.statusCode).toEqual(400);
    expect(res5.body.message).toEqual('Email is invalid');

    // Password have less that 8 characters
    const res6 = await request(server)
      .post('/api/users')
      .send({ username, email, password: 'fake' });

    expect(res6.statusCode).toEqual(400);
    expect(res6.body.message).toEqual(
      'Password must contain at least 8 characters',
    );
  });

  test('User creation fails if username or email already exists', async () => {
    const { username, email } = await createTestUser();

    // Username already existing
    const res1 = await request(server)
      .post('/api/users')
      .send({ username, email: 'otherEmail@gmail.com', password: 'password' });
    expect(res1.statusCode).toEqual(409);
    expect(res1.body.message).toEqual('Username already exists');

    // Email already existing
    const res2 = await request(server)
      .post('/api/users')
      .send({ username: 'otherUsername', email, password: 'password' });
    expect(res2.statusCode).toEqual(409);
    expect(res2.body.message).toEqual('Email already exists');
  });

  test('Create beds for a new user user', async () => {
    const username = 'fakeUser';
    const email = 'fakeUser@gmail.com';
    const password = 'fakeUserPwd';

    await request(server)
      .post('/api/users')
      .send({ username, email, password });

    const { agent } = await createAuthenticatedAgent(server);

    const res = await agent.get('/api/beds/');

    const beds: Bed[] = res.body;

    expect(res.statusCode).toEqual(200);
    expect(beds).toHaveLength(10);
  });

  test('Create tasks for a new user user', async () => {
    const username = 'fakeUser';
    const email = 'fakeUser@gmail.com';
    const password = 'fakeUserPwd';

    await request(server)
      .post('/api/users')
      .send({ username, email, password });

    const { agent } = await createAuthenticatedAgent(server);

    const res = await agent.get('/api/tasks/');
    const tasks: Task[] = res.body;

    expect(res.statusCode).toEqual(200);
    expect(tasks).toHaveLength(2);
  });

  test('Get current authentificated user', async () => {
    const { agent } = await createAuthenticatedAgent(server);

    const res = await agent.get('/api/users');

    expect(res.statusCode).toEqual(200);
  });
});

import type { Server } from 'http';
import request from 'supertest';

import type { Task } from '../../src/entities/task';
import {
  clearDatabase,
  closeDatabase,
  createAuthenticatedAgent,
  createTestServer,
} from '../utils/testsHelpers';

let server: Server;

beforeAll(async () => {
  server = await createTestServer();
});

afterAll(async () => {
  await closeDatabase();
  server.close();
});

describe('Tasks routes', () => {
  afterEach(async () => {
    await clearDatabase();
  });

  test('Get tasks for authentificated user', async () => {
    const { agent } = await createAuthenticatedAgent(server);

    const res = await agent.get('/api/tasks/');

    const tasks: Task[] = res.body;

    expect(res.statusCode).toEqual(200);
    expect(tasks).toHaveLength(2);
  });

  test('Throw an error if not authentificated user tries to get tasks', async () => {
    const res = await request(server).get('/api/tasks/');

    expect(res.statusCode).toEqual(401);
  });

  test.todo(
    'Throw an error if not authentificated user tries to complete a task',
  );
  test.todo('Complete task for an authentificated user');
  test.todo('Complete task fails if the task is already completed');

  test.todo('Throw and error if not authentificated user tries to fail a task');
  test.todo('Fail task for an authentificated user');
  test.todo('Fail task fails if the task is already completed');
});

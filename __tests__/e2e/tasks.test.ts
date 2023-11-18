import type { Server } from 'http';
import request from 'supertest';

import type { UserTask } from '../../src/entities/user-task';
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

    const tasks: UserTask[] = res.body;

    expect(res.statusCode).toEqual(200);
    expect(tasks).toHaveLength(2);
  });

  test('Throw an error if not authentificated user tries to get tasks', async () => {
    const res = await request(server).get('/api/tasks/');

    expect(res.statusCode).toEqual(401);
  });

  test('Throw an error if not authentificated user tries to complete a task', async () => {
    const res = await request(server).post('/api/tasks/complete');

    expect(res.statusCode).toEqual(401);
  });

  test('Complete task without providing task id', async () => {
    const { agent } = await createAuthenticatedAgent(server);

    const res = await agent.post('/api/tasks/complete');

    expect(res.statusCode).toEqual(400);
  });

  test('Complete task providing task id of a wrong type', async () => {
    const { agent } = await createAuthenticatedAgent(server);

    const res = await agent.post('/api/tasks/complete').send({ id: 123 });

    expect(res.statusCode).toEqual(400);
  });

  test('Complete task for an authentificated user', async () => {
    const { agent } = await createAuthenticatedAgent(server);

    const res = await agent.post('/api/tasks/complete').send({ id: '123' });

    expect(res.statusCode).toEqual(200);
  });

  test('Complete task fails if the task is already completed', async () => {
    const { agent } = await createAuthenticatedAgent(server);

    const res = await agent.post('/api/tasks/complete/').send({ id: '123' });

    expect(res.statusCode).toEqual(409);
  });

  test('Throw and error if not authentificated user tries to fail a task', async () => {
    const res = await request(server).post('/api/tasks/fail');

    expect(res.statusCode).toEqual(401);
  });

  test('Fail task without providing task id', async () => {
    const { agent } = await createAuthenticatedAgent(server);

    const res = await agent.post('/api/tasks/fail');

    expect(res.statusCode).toEqual(400);
  });

  test('Fail task providing task id of a wrong type', async () => {
    const { agent } = await createAuthenticatedAgent(server);

    const res = await agent.post('/api/tasks/fail').send({ id: 123 });

    expect(res.statusCode).toEqual(400);
  });

  test('Fail task for an authentificated user', async () => {
    const { agent } = await createAuthenticatedAgent(server);

    const res = await agent.post('/api/tasks/fail').send({ id: '123' });

    expect(res.statusCode).toEqual(200);
  });

  test('Fail task fails if the task is already completed', async () => {
    const { agent } = await createAuthenticatedAgent(server);

    const res = await agent.post('/api/tasks/fail').send({ id: '123' });

    expect(res.statusCode).toEqual(409);
  });
});

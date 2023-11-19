import type { Server } from 'http';
import request from 'supertest';

import { TaskEnum } from '../../src/entities/task';
import type { UserTask } from '../../src/entities/user-task';
import type { Survey } from '../../src/entities/survey';
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

describe('Products routes', () => {
  afterEach(async () => {
    await clearDatabase();
  });

  test('Get products for authentificated user', async () => {
    const { agent } = await createAuthenticatedAgent(server);

    const tasksRes = await agent.get('/api/tasks');
    const tasks: UserTask[] = tasksRes.body;

    const surveyTask = tasks.find(
      (item) => item.task.type === TaskEnum.FinanceGenius,
    );

    if (surveyTask) {
      const res = await agent.get(`/api/surveys?taskId=${surveyTask.task.id}`);

      const survey: Survey = res.body;

      expect(res.statusCode).toEqual(200);
      expect(survey.questions).toHaveLength(4);
    }
  });

  test('Throw an error if not authentificated user tries to get tasks', async () => {
    const res = await request(server).get('/api/surveys/');

    expect(res.statusCode).toEqual(401);
  });

  test('Throw an error if task id is not uuid', async () => {
    const { agent } = await createAuthenticatedAgent(server);

    const res = await agent.get('/api/surveys?taskId=123');

    expect(res.statusCode).toEqual(400);
  });
});

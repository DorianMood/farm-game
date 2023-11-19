/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Server } from 'http';
import request from 'supertest';
import type { Express } from 'express';

import createServer from '../../src/config/server';
import { AppDataSource } from '../../src/data-source';
import { TaskEnum } from '../../src/entities/task';
import type { User } from '../../src/entities/user';
import type { TestUserProps } from './userHelpers';
import { createTestUser } from './userHelpers';
import { createTestTask, createUserTestTask } from './taskHelpers';
import { createBeds } from './bedsHelpers';
import { createTestProduct } from './productsHelpers';
import { createTestQuestion, createTestSurvey } from './surveysHelpers';

interface OverrideExpressOptions {
  logout?: (cb: any) => unknown;
  logIn?: (user: any, cb: any) => unknown;
}

const overrideExpressServer = (
  server: Express,
  overrideExpressOptions: OverrideExpressOptions,
) => {
  if (overrideExpressOptions.logout) {
    server.request.logOut = overrideExpressOptions.logout;
  }
  if (overrideExpressOptions.logIn) {
    server.request.logIn = overrideExpressOptions.logIn;
  }
  return server;
};

/**
 * Create a test server.
 * @param port - Port used to listen server. Default 7777. Optional.
 * @param preventDatabaseConnection - If true, database connection is not initialized. Default false. Optional.
 * @param overrideExpressOptions - Object used to override Express. Optional.
 * @returns The created test server.
 */
export const createTestServer = async (
  port = 7777,
  preventDatabaseConnection = false,
  overrideExpressOptions?: OverrideExpressOptions,
) => {
  const server = createServer();
  if (overrideExpressOptions) {
    overrideExpressServer(server, overrideExpressOptions);
  }

  if (!preventDatabaseConnection) {
    await AppDataSource.initialize();
  }

  return server.listen(port);
};

/**
 * Close the database connection.
 */
export const closeDatabase = async () => {
  await AppDataSource.destroy();
};

/**
 * Clear the database data.
 */
export const clearDatabase = async () => {
  const entities = AppDataSource.entityMetadatas
    .map((entity) => `"${entity.tableName}"`)
    .join(', ');
  await AppDataSource.query(`TRUNCATE ${entities} CASCADE;`);
};

/**
 * Create an authenticated test agent. A test agent allows to maintain session between multiple requests.
 * @param server - The server used by the agent.
 * @param testUser - The authenticated user informations. Optional.
 * @returns The created agent.
 */
export const createAuthenticatedAgent = async (
  server: Server,
  testUser?: TestUserProps,
) => {
  const userAgent = request.agent(server);
  const user = await createTestUser(testUser);
  await userAgent
    .post('/api/auth/login')
    .send({ login: user.username, password: testUser?.password || 'password' });

  return { agent: userAgent, user };
};

export const initializeDatabase = async (user: User) => {
  const tasks = [
    await createTestTask({ cost: 1, type: TaskEnum.Plant }),
    await createTestTask({ cost: 10, type: TaskEnum.FinanceGenius }),
  ];

  await createBeds(user);
  await createUserTestTask(tasks, [user]);

  for (let i = 0; i < 4; i++) {
    await createTestProduct({
      name: `Product ${i}`,
      price: i + 1,
      content: 'product content',
    });
  }

  const questions = [];
  for (let i = 0; i < 4; i++) {
    questions.push(
      await createTestQuestion({
        question: `question ${i}`,
        answer: `answer ${i}`,
      }),
    );
  }

  await createTestSurvey(questions, tasks[1]);
};

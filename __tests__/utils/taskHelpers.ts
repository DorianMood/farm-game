import { AppDataSource } from '../../src/data-source';
import { User } from '../../src/entities/user';
import { Task, TaskEnum } from '../../src/entities/task';
import { UserTask } from '../../src/entities/user-task';

interface TestTaskProps {
  cost: number;
  type: TaskEnum;
}

/**
 * Create a user in database.
 * @param testTask - Task informations.
 * @returns The created task
 */
export const createTestTask = async (testTask: TestTaskProps) => {
  const taskRepo = AppDataSource.getRepository(Task);

  const task = new Task();
  task.cost = testTask.cost;
  task.type = testTask.type;

  await taskRepo.save(task);
  return task;
};

/**
 * Create a user in database.
 * @param tasks - Tasks list.
 * @param users - Users list.
 * @returns The created user tasks list
 */
export const createUserTestTask = async (tasks: Task[], users: User[]) => {
  const userTaskRepo = AppDataSource.getRepository(UserTask);

  for (let task of tasks) {
    for (let user of users) {
      const userTask = new UserTask();
      userTask.task = task;
      userTask.user = user;

      await userTaskRepo.save(userTask);
    }
  }
};

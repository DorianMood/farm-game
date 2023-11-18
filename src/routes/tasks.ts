import express from 'express';

import TasksController from '../controllers/tasks';

const router = express.Router();

router.route('/').get(TasksController.retrieve);

export default router;

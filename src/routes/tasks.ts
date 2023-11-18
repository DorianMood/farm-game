import express from 'express';

import TasksController from '../controllers/tasks';

const router = express.Router();

router.route('/').get(TasksController.retrieve);
router.route('/complete/').post(TasksController.complete);
router.route('/fail/').post(TasksController.fail);

export default router;

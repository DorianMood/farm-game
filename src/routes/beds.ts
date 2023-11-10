import express from 'express';

import BedsController from '../controllers/beds';

const router = express.Router();

router.route('/').get(BedsController.retrieve);

export default router;

import express from 'express';

import BedsController from '../controllers/beds';

const router = express.Router();

router.route('/').get(BedsController.retrieve);
router.route('/harvest').post(BedsController.harvest);
router.route('/plant').post(BedsController.plant);

export default router;

import express from "express";

import BarnsController from "../controllers/barns";

const router = express.Router();

router.route("/").get(BarnsController.retrieve);
router.route("/harvest").post(BarnsController.harvest);

export default router;

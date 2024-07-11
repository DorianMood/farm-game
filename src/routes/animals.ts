import express from "express";

import AnimalsController from "../controllers/animals";

const router = express.Router();

router.route("/").get(AnimalsController.retrieve);
router.route("/harvest").post(AnimalsController.harvest);
router.route("/start").post(AnimalsController.start);

export default router;

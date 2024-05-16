import express from "express";

import SurveysController from "../controllers/surveys";

const router = express.Router();

router.get("/", SurveysController.retrieve);

export default router;

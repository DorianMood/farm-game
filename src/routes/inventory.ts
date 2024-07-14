import express from "express";

import InventoryController from "../controllers/inventory";

const router = express.Router();

router.route("/").get(InventoryController.retrieve);

export default router;

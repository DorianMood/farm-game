import express from "express";

import InventoryController from "../controllers/inventory";

const router = express.Router();

router.route("/").get(InventoryController.retrieve);
router.route("/activate").post(InventoryController.activate);

export default router;

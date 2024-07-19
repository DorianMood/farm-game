import express from "express";

import ProductsController from "../controllers/products";

const router = express.Router();

router.route("/").get(ProductsController.retrieve);
router.route("/purchase").post(ProductsController.purchase);
router.route("/sell").post(ProductsController.sell);

export default router;

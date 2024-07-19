import express from "express";
import "express-async-errors";

import authRoutes from "./auth";
import usersRoutes from "./users";
import bedsRoutes from "./beds";
import barnsRoutes from "./barns";
import tasksRoutes from "./tasks";
import productsRoutes from "./products";
import surveysRoutes from "./surveys";
import animalsRoutes from "./animals";
import inventoryRoutes from "./inventory";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/beds", bedsRoutes);
router.use("/barns", barnsRoutes);
router.use("/tasks", tasksRoutes);
router.use("/products", productsRoutes);
router.use("/surveys", surveysRoutes);
router.use("/animals", animalsRoutes);
router.use("/inventory", inventoryRoutes);

router.route("/health").get((req, res) => res.send("Server is up!"));

export default router;

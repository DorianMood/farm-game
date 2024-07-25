import express from "express";

import UsersController from "../controllers/users";

const router = express.Router();

router.route("/").get(UsersController.retrieve);
router.route("/").post(UsersController.create);
router.route("/rating").get(UsersController.rating);

export default router;

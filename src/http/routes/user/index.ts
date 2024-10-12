import express from "express";
import { userControllers } from "../../controllers/user";

const router = express.Router();
router.route("/").post((req, res) => userControllers.createUser(req, res));

export default router;

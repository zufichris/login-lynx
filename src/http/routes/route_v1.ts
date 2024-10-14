import express from "express";
import AuthRoutes from "./auth";
import UserRoutes from "./user";
import { AuthMiddleWare } from "../middleware/auth";

const router = express.Router();
router.use(AuthMiddleWare());
router.use("/auth", AuthRoutes);
router.use("/user", UserRoutes);

export default router;

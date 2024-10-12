import express from "express";
import AuthRoutes from "./auth";
import UserRoutes from "./user";

const router = express.Router();

router.use("/auth", AuthRoutes);
router.use("/user", UserRoutes);

export default router;

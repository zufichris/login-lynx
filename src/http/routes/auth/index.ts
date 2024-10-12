import express from "express";
import GoogleAuthRoutes from "./google";

const router = express.Router();
router.use("/google", GoogleAuthRoutes);

export default router;

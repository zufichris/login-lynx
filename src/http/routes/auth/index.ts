import express from "express";
import { Auth } from "../../middleware/auth";
import { userControllers } from "../../controllers/user";

const router = express.Router();
router.get(
  "/google",
  (req, res) => Auth.googleAuthRequest(req, res)
);
router.get(
  "/google/callback",
  (req, res, next) => Auth.getGoogleTokens(req, res, next),
  (req, res, next) => Auth.getGoogleUser(req, res, next),
  (req, res) => userControllers.createUser(req, res)
);
export default router;

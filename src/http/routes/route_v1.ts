import express from "express";
import AuthRoutes from "./auth";
import UserRoutes from "./user";
import { Auth } from "../middleware/auth";
const router = express.Router();

router.use(
  "/auth",
  (req, res, next) => {
    const token = req.get("cookie")?.split("=")[1];
    if (!token) next();
    else {
      const user = token ? JSON.parse(Auth.decodeJWT(token)) : null;
      if (user) res.redirect("/");
      else next();
    }
  },
  AuthRoutes
);
router.use("/users", UserRoutes);
export default router;

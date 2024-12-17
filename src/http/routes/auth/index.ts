import express from "express";
import { authControllers } from "../../controllers/auth";
import path from "path";

const router = express.Router();

router
  .route("/")
  .post((req, res, next) => authControllers.register(req, res, next))
  .get((req, res) => {
    const filePath = path.resolve(__dirname, "../../../views/register.html");
    res.status(200).sendFile(filePath, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.redirect("/error");
      }
    });
  });

router
  .route("/login")
  .get((req, res) => {
    const filePath = path.resolve(__dirname, "../../../views/login.html");
    res.sendFile(filePath, (err) => {
      console.log(err);
    });
  })
  .post((req, res) => authControllers.login(req, res));

router.get("/logout", (req, res) => authControllers.logout(req, res));

router.get("/google", (_, res) => authControllers.googleAuth.authRequest(res));
router.get(
  "/google/callback",
  (req, res, next) => authControllers.googleAuth.getTokens(req, res, next),
  (req, res, next) => authControllers.googleAuth.getUserProfile(req, res, next),
  (req, res) => authControllers.socialLogin(req, res)
);
export default router;

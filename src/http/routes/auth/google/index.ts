import express from "express";
import passport from "passport";
import { GoogleStrategy } from "../../../../config/auth/googleoauth2";
import { IUser } from "../../../../data/entities/user";
passport.use(GoogleStrategy);
passport.serializeUser(function (user, done) {
  done(null, user as Express.User); // Use the unique identifier
});

passport.deserializeUser(function (user, done) {
  done(null, user as IUser);
});

const router = express.Router();

router.get("/", passport.authenticate("google"));
router.get("/login", (req, res) => {
  res.send("<h1>Login</h1>");
});

router.get("/home", (req, res) => {
  res.send("<h1>Home</h1>");
});

router.get(
  "/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/v1/auth/google/login",
    successRedirect: "/api/v1/auth/google/home",
  })
);
export default router;

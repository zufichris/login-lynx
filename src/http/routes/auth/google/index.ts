import express from "express";
import passport from "passport";
import { googleAuth } from "../../../../config/auth/googleoauth2";
const router = express.Router();
passport.use(googleAuth);
router.get(
  "/",
  passport.authenticate(
    "google",
    {
      successRedirect: "apple.com",
      successMessage: "Auth Success",
    },
    () => {
      console.log("saksss;");
    }
  )
);

router.get(
  "/callback",
  passport.authenticate("google", {
    successReturnToOrRedirect: "/ayaba",
    failureRedirect: "/jaj",
    successMessage: "syhsyhsuysus",
    successRedirect: "apple.com",
  })
);

export default router;

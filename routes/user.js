const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/user.js");

// Show signup/login forms and sign up handler
router.get("/signup", userController.rendersignup);
router.post("/signup", userController.signup);
router.get("/login", userController.renderlogin);

// Login POST: preserve returnTo before passport runs, use successReturnToOrRedirect,
// and fall back to userController.login (not authController)
router.post(
  "/login",
  (req, res, next) => {
    console.log("👉 Pre-auth session.returnTo =", req.session && req.session.returnTo);
    if (req.session && req.session.returnTo) {
      req.session.redirectToAfterLogin = req.session.returnTo;
      return req.session.save(err => {
        if (err) console.error("❌ session save error (pre-auth preserve):", err);
        next();
      });
    }
    next();
  },
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
    successReturnToOrRedirect: "/listings"
  }),
  // Fallback (rare). Use userController.login, not authController.
  userController.login
);

router.get("/logout", userController.logout);

module.exports = router;

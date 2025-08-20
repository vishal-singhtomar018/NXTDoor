// routes/user.js
const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/user");

// Signup routes
router.get("/signup", userController.rendersignup);
router.post("/signup", userController.signup);

// Login form
router.get("/login", userController.renderlogin);

// Login POST: let passport use req.session.returnTo if present
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
    successReturnToOrRedirect: "/listings"
  }),
  // Fallback (rare): controller will clean up and redirect using session.returnTo
  userController.login
);

// Logout
router.get("/logout", userController.logout);

module.exports = router;

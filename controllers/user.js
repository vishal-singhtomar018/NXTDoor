// controllers/user.js
const User = require("../models/user"); // adjust if model path differs
// const passport = require("passport");

module.exports.rendersignup = (req, res) => {
  res.render("users/signup"); // adjust view path
};

module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password); // if using passport-local-mongoose
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome! Your account has been created.");
      return res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message || "Something went wrong.");
    return res.redirect("/signup");
  }
};

module.exports.renderlogin = (req, res) => {
  res.render("users/login"); // adjust view path
};

// Fallback login controller (used if passport doesn't auto-redirect)
module.exports.login = (req, res) => {
  req.flash("success", "Welcome back!");
  let redirectUrl=res.locals.redirectUrl || "/listings"
  return res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Goodbye!");
    res.redirect("/listings");
  });
};

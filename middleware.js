const { reset } = require("nodemon");
const Listing = require("./models/listing");
const Review = require("./models/review.js");

// module.exports.saveRedirectUrl = (req, res, next) => {
//     if (!req.session.returnTo && req.headers.referer) {
//         // Save the referer (previous page) only if returnTo is not already set
//         req.session.returnTo = req.headers.referer;
//         console.log(`📌 Saved returnTo from referer: ${req.headers.referer}`);
//     } else if (req.session.returnTo) {
//         console.log(`📌 returnTo already exists: ${req.session.returnTo}`);
//     } else {
//         console.log("⚠️ No referer and no returnTo found.");
//     }
//     next();
// };

// middleware.js
// middleware/isLoggedIn.js
module.exports.isloggedIn = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  const url = req.originalUrl;
  console.log(`👀 Attempted URL: ${url}`);

  // ignore static files and auth routes
  const isStatic = !!url.match(/\.(js|css|jpg|jpeg|png|gif|ico|svg)$/i);
  const isAuthRoute =
    url.startsWith("/login") ||
    url.startsWith("/signup") ||
    url.startsWith("/logout");
  if (isStatic || isAuthRoute || req.method !== "GET") {
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }

  // Treat index-like routes specially so they don't clobber deeper saved links
  const isIndexRoute = url === "/" || url === "/listings" || url === "/home";

  // If a deep link is already stored, don't overwrite it with an index route
  if (isIndexRoute && req.session && req.session.returnTo) {
    console.log(
      `ℹ️ Ignoring index route (${url}) because deeper returnTo exists: ${req.session.returnTo}`
    );
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }

  // Save the deep link (or index if no deep link present)
  if (req.session) {
    req.session.returnTo = url;
    res.locals.returnTo = url; // optional for views
    console.log(`🔐 Saved returnTo (session): ${req.session.returnTo}`);
    // Persist session to store before redirecting
    return req.session.save((err) => {
      if (err) console.error("❌ Session save error:", err);
      req.flash("error", "You must be signed in first!");
      return res.redirect("/login");
    });
  }

  // Fallback (should rarely happen)
  req.flash("error", "You must be signed in first!");
  return res.redirect("/login");
};

module.exports.isreviewloggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "you must logged in to delete review");
    return res.redirect("/login");
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "you don't have permission to edit");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewsId } = req.params;
  let review = await Review.findById(reviewsId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("success", "you don't have permission to edit");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

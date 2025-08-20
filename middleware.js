const { reset } = require("nodemon");
const Listing = require("./models/listing");
const Review = require("./models/review.js");


module.exports.isloggedIn=(req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) return next();

  const url = req.originalUrl;
  console.log(`👀 Attempted URL: ${url}`);

  const isStatic = !!url.match(/\.(js|css|jpg|jpeg|png|gif|ico|svg)$/i);
  const isAuthRoute = url.startsWith("/login") || url.startsWith("/signup") || url.startsWith("/logout");
  if (isStatic || isAuthRoute || req.method !== "GET") {
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }

  // consider an index/general route list here
  const isIndexRoute = (u) => u === "/" || u === "/listings" || u === "/home";

  // Helper: is URL "deeper" (more specific) than existing
  const isDeeper = (existing, candidate) => {
    if (!existing) return true;
    // If existing is index and candidate is not, candidate is deeper
    if (isIndexRoute(existing) && !isIndexRoute(candidate)) return true;
    // prefer longer paths (simple heuristic). Also prefer ones that include an id or subpath.
    if (candidate.length > existing.length) return true;
    return false;
  };

  // Decide whether to set/overwrite returnTo
  if (!req.session) {
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }

  const existing = req.session.returnTo;
  if (!existing || isDeeper(existing, url)) {
    req.session.returnTo = url;
    res.locals.returnTo = url;
    console.log(`🔐 Saved returnTo (session): ${req.session.returnTo}`);
    // Optional: enable for debugging who called it
    // console.trace();

    return req.session.save(err => {
      if (err) console.error("❌ Session save error:", err);
      req.flash("error", "You must be signed in first!");
      return res.redirect("/login");
    });
  }

  // If we reach here, we decided NOT to overwrite (existing is deeper or equal)
  console.log(`ℹ️ returnTo already set and not overwritten: ${existing}`);
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



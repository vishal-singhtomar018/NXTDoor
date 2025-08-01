const { reset } = require("nodemon");
const Listing=require("./models/listing");
const Review=require("./models/review.js");



module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.redirectUrl = req.session.returnTo;
    }
    next();
};


// middleware.js
module.exports.isloggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be signed in first!");
        return res.redirect("/login");
    }
    next();
};


module.exports.isreviewloggedIn=(req,res,next)=>
{
    if(!req.isAuthenticated())
        {
            req.flash("error","you must logged in to delete review");
            return res.redirect("/login");
        }
        next();
}

// middleware.js or wherever you defined it
// middleware.js
// middleware.js



module.exports.isOwner=async(req,res,next)=>
{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id))
    {
        req.flash("error","you don't have permission to edit");
       return res.redirect(`/listings/${id}`);
    } 
    next();
}

module.exports.isReviewAuthor=async(req,res,next)=>
{
    let {id,reviewsId}=req.params;
    let review=await Review.findById(reviewsId);
    if(!review.author.equals(res.locals.currUser._id))
    {
        req.flash("success","you don't have permission to edit");
       return res.redirect(`/listings/${id}`);
    } 
    next();
}
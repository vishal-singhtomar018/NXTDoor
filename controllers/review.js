const Listing=require("../models/listing.js");
const Review=require("../models/review.js");


module.exports.createreview=async(req,res,next)=>
{
    try
    {
        let listing=await Listing.findById(req.params.id);
        let newReview=new Review(req.body.review);
        newReview.author=req.user._id;  
        listing.reviews.push(newReview);
        // console.log(newReview);
        await newReview.save();
        await listing.save();
        req.flash("success","New review is Created");
        res.redirect(`/listings/${listing._id}`);
    }
    catch(err)
    {
        next(err)
    }
}

module.exports.deletereview=async(req,res)=>
{
    let id=req.params.id;
    let reviewId=req.params.reviewsId;
    await Listing.findByIdAndUpdate(id,{ $pull: {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review has been deleted");
    res.redirect(`/listings/${id}`);
}
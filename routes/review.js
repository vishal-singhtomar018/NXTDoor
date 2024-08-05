const express=require("express");
const router=express.Router({mergeParams:true});
const {reviewSchema}=require("../schema.js");
const ExpressError=require("../util/ExpressError.js");
const reviewController=require("../controllers/review.js")
const flash=require("connect-flash");
const {isloggedIn,isReviewAuthor,isreviewloggedIn}=require("../middleware.js")

router.use(flash());
router.use((req,res,next)=>
{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})


const validateReview =(req,res,next)=>
{
    let {error}= reviewSchema.validate(req.body);
    if(error)
    {
        let errMsg=error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errMsg)
    }
    else
    {
        next()
    }
}


router.post("/:id/reviews",isloggedIn,validateReview,reviewController.createreview);

// DELETE REVIEW

router.delete("/:id/reviews/:reviewsId",isreviewloggedIn,isReviewAuthor,reviewController.deletereview)
module.exports=router;


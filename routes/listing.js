const express=require("express");
const router=express.Router({caseSensitive: false});
const {isloggedIn,isOwner}=require("../middleware.js");
const {listingSchema}=require("../schema.js");
const listingController=require("../controllers/listing.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});



// const validateListing =(req,res,next)=>
// {
//     let {error}= listingSchema.validate(req.body);
//     if(error)
//     {
//         let errMsg=error.details.map((el)=>el.message).join(",")
//         throw new ExpressError(400,errMsg)
//     }
//     else
//     {
//         next()
//     }
// }

router.route("/")
  .get(listingController.index)
  .post(
    isloggedIn,
    upload.array("images", 4), // match input name
    listingController.Createnewlisting
  );



router.get("/new",isloggedIn,listingController.renderNewForm);;
// router.post("/search",listingController.FilterSearch);


router.route("/:id")
.put(isloggedIn,isOwner,upload.single("listing[image]"),listingController.updatelistings)
.delete(isloggedIn,isOwner,listingController.deletelistings);


router.get("/:id",listingController.showlistings);
router.get("/:id/edit",isloggedIn,isOwner,listingController.editListings); 

router.post("/submit",listingController.submit);

module.exports=router;

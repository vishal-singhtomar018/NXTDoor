const express=require("express");
const router=express.Router({caseSensitive: false});
const {isloggedIn,isOwner}=require("../middleware.js");
const listingController=require("../controllers/listing.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});

router.route("/")
  .get(listingController.index)
  .post(
    isloggedIn,
    upload.array("images", 4), // match input name
    listingController.Createnewlisting
  );

// router.get("/map",listingController.CreateMap);


router.get("/new",isloggedIn,listingController.renderNewForm);;
// router.post("/search",listingController.FilterSearch);

router.get("/MyListing",isloggedIn, listingController.MyListing);
router.get("/profile",isloggedIn,listingController.profile);
router.route("/:id")
.put(isloggedIn,isOwner,upload.single("listing[image]"),listingController.updatelistings)
.delete(isloggedIn,isOwner,listingController.deletelistings);


router.get("/:id",listingController.showlistings);
router.get("/:id/edit",isloggedIn,isOwner,listingController.RendereditListings); 

router.post("/submit",listingController.submit);



module.exports=router;

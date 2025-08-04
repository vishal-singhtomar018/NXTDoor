const express=require("express");
const router=express.Router({caseSensitive: false});
const listingController=require("../controllers/listing.js");



router.get("/listings/explore",listingController.explore);

module.exports=router;

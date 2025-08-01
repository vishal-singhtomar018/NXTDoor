const express=require("express");
const router=express.Router({caseSensitive: false});
const listingController=require("../controllers/listing.js");



router.get("/explore",listingController.explore);

module.exports=router;

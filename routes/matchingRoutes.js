const express=require("express");
const router=express.Router({caseSensitive: false});
const SearchController=require("../controllers/matchingController");



router.get("/",SearchController.FilterSearch);

module.exports=router;


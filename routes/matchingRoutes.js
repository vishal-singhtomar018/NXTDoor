const express=require("express");
const router=express.Router({caseSensitive: false});
const FilterController=require("../controllers/matchingController");
// const SearchController=require("../controllers/Search")



router.get("/",FilterController.FilterSearch);
// router.post("listings/submit",SearchController.submit);

module.exports=router;


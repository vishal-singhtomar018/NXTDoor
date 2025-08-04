const express=require("express");
const router=express.Router({caseSensitive: false});
const SearchController=require("../controllers/listingsearch.js")


router.post("/submit", SearchController.SearchFilter);


module.exports=router;







const express=require("express");
const router=express.Router({caseSensitive: false});
const app=express();
const Listing=require("../models/listing");
const listingController=require("../controllers/listing.js");
const {isloggedIn,isOwner}=require("../middleware.js");




// router.post("/submit",listingController.submit);

// router.post('/submit',async (req, res) => {
//     const query = {country: req.body.title};
//     const allListings = await Listing.find({location:query.country});
//     if(allListings=="")
//     {
//         res.send("no data found");
//     }
//     else
//     {
//         res.render("listings/Searchresult.ejs",{allListings});
//     }
// });


// module.exports=router;









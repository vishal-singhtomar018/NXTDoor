const express=require("express");
const app=express();
const mongoose=require("mongoose");
const initData =require("./data.js");
const Listing=require("../models/listing.js");


const MONGO_URL="mongodb://127.0.0.1:27017/Roomrent";

main()
.then((res)=>{
    console.log("connected to DB");
})
.catch((err)=>
{
    console.log(err);
})

async function main()
{
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "68874b57dfeb8226a3e7156e",
        amenities: obj.amenities || {  // Ensure amenities is always present
            petFriendly: false,
            wifi: false,
            parking: false,
            kitchen: false,
            bachelors: false,
            furnished: false,
        }
    }));
    
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};
initDB();

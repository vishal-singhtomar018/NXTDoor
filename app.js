if(process.env.NODE_ENV !="production"){
    require("dotenv").config();
}
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const methodOverride = require('method-override');
const path=require("path");
app.use(express.static('public'));

const MONGO_URL = process.env.ATLASDB_URL;
const ejsMate=require("ejs-mate");
const flash=require("connect-flash");
const session=require("express-session");
const cookieParser = require('cookie-parser');
app.use(cookieParser("secretcode"));
const passport=require("passport");
const localStrategy=require("passport-local");
const ExpressError = require("./util/ExpressError.js");
const User = require("./models/user");
const MongoStore = require("connect-mongo");


// const { ConnectionClosedEvent } = require("mongodb");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")))
// app.use(express.static(path.join(__dirname,"public.js")))
const UserRoute=require("./routes/user.js");
const signup=require("./routes/signup.js");
const listings =require("./routes/listing.js");
const Reviews=require("./routes/review.js");
const explore=require("./routes/explore.js")
const FilterSearch=require("./routes/matchingRoutes.js");
const ListingSearch=require("./routes/listingsearch.js");



const store = MongoStore.create({
    mongoUrl:process.env.ATLASDB_URL,
    crypto: {
        secret:process.env.SECRET
    },
    touchAfter: 24 * 3600, // time period in seconds
    collectionName: 'sessions'
});


const sessionOptions = session({
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
});

app.use(sessionOptions);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



main()
.then(() => {
    console.log("connected to DB");
})
.catch((err) => {
    console.error("Database connection failed:", err);
});


async function main() {
    await mongoose.connect(process.env.ATLASDB_URL);
}

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;

    // Save returnTo only on GET requests to non-static, protected routes
    if (
        req.method === "GET" &&
        !req.path.startsWith("/login") &&
        !req.path.startsWith("/signup") &&
        !req.path.startsWith("/logout") &&
        !req.path.startsWith("/js") &&
        !req.path.startsWith("/css") &&
        !req.path.startsWith("/images") &&
        !req.path.startsWith("/favicon.ico") &&
        !req.isAuthenticated()
    ) {
        req.session.returnTo = req.originalUrl;
    }

    next();
});

app.get('/', (req, res) => {
  res.redirect('/listings');
});


app.use("/",explore);
app.use("/",ListingSearch);
app.use("/listings",listings);
app.use("", UserRoute);
app.use("/listings",Reviews);
app.use("/",signup);
app.use("/search",FilterSearch);



app.use("/about",(req,res)=>
{
    res.render("listings/about.ejs")
})


// app.post('/submit', async (req, res) => {
//     try {
//         // Ensure the title exists, convert to string and trim spaces
//         let countryInput = String(req.body.title || '').trim();  // Convert to string, handle undefined/null
        
//         // Remove unnecessary spaces between words
//         countryInput = countryInput.replace(/\s+/g, ' ');  // Replace multiple spaces with single space

//         // Get the city name (country) from the form input
//         const cityName = countryInput;

//         // Check if the cityName is not empty
//         if (!cityName) {
//             return res.send("Please provide a valid country name.");
//         }

//         // Perform case-insensitive search using $regex
//         const allListings = await Listing.find({ location: { $regex: cityName, $options: 'i' } });

//         // Check if there are any listings found
//         if (allListings.length === 0) {
//             res.send("No data found for this");
//         } else {
//             res.render("listings/Searchresult.ejs", { allListings });
//         }
//     } catch (error) {
//         console.error("Error while fetching listings:", error);
//         res.status(500).send("An error occurred while processing your request.");
//     }
// });




app.all("*",(req,res,next)=>
{
     next(new ExpressError(404 ,"Page Not Found!"));
})


app.use((err,req,res,next)=>
{
   let {statuscode=500 ,message="something went wrong"}=err;
   res.render("err.ejs",{statuscode,message});
})

const PORT = process.env.PORT || 8080;
app.listen(PORT,()=>{
    console.log("server is listening to port 8080");
})

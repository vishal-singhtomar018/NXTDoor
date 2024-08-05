if(process.env.NODE_ENV !="production"){
    require("dotenv").config();
}
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const methodOverride = require('method-override');
const path=require("path");
const MONGO_URL=('mongodb://127.0.0.1:27017/wanderlust');
const ejsMate=require("ejs-mate");
const flash=require("connect-flash");
const session=require("express-session");
const cookieParser = require('cookie-parser');
app.use(cookieParser("secretcode"));
const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js")
const UserRoute=require("./routes/user.js");
const signup=require("./routes/signup.js");
const listings =require("./routes/listing.js");
const Reviews=require("./routes/review.js");
const Listing=require("./models/listing");
const search=require("./routes/search.js")
// const { ConnectionClosedEvent } = require("mongodb");




app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")))


const sessionOptions=(session({
    secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true,
    cookie:
    {
        expiers:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
})  
);


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



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


app.use((req,res,next)=>
{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    // console.log(currUser);
    next();
})



app.use("/listings",listings);
app.use("/", UserRoute);
app.use("/listings",Reviews);
app.use("/",signup);
app.use("/submit",search);

app.use("/about",(req,res)=>
{
    res.render("listings/about.ejs")
})


app.post('/submit',async (req, res) => {
    const query = {country: req.body.title};
    const allListings = await Listing.find({location:query.country});
    if(allListings=="")
    {
        res.send("no data found");
    }
    else
    {
        res.render("listings/Searchresult.ejs",{allListings});
    }
});

app.all("*",(req,res,next)=>
{
    next(new ExpressError(404 ,"Page Not Found!"));
})


app.use((err,req,res,next)=>
{
   let {statuscode=500 ,message="something went wrong"}=err;
   res.render("err.ejs",{message});
})

app.listen(3000,()=>{
    console.log("server is listening to port 3000");
})
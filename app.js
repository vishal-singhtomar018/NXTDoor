if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require('method-override');
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));


const ejsMate = require("ejs-mate");
const flash = require("connect-flash");
const session = require("express-session");
const cookieParser = require('cookie-parser');
app.use(cookieParser("secretcode"));
const passport = require("passport");
const localStrategy = require("passport-local");
const ExpressError = require("./util/ExpressError.js");
const User = require("./models/user");
const MongoStore = require("connect-mongo");

// Routes
const UserRoute = require("./routes/user.js");
// const signup = require("./routes/signup.js");
const listings = require("./routes/listing.js");
const Reviews = require("./routes/review.js");
const explore = require("./routes/explore.js");
const FilterSearch = require("./routes/matchingRoutes.js");
const ListingSearch = require("./routes/listingsearch.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);



const store = MongoStore.create({
    mongoUrl: process.env.ATLASDB_URL,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600,
    collectionName: 'sessions'
});

const sessionOptions = session({
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        // expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
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
    // res.locals.redirectUrl=req.session.redirectUrl;
    next();
});


app.get('/', (req, res) => {
    res.redirect('/listings');
});


// Routes (unchanged)
app.use("/", explore);
app.use("/", ListingSearch);
app.use("/listings", listings);
app.use("", UserRoute);
app.use("/listings", Reviews);
// app.use("/", signup);
app.use("/search", FilterSearch);
app.use("/about", (req, res) => {
    res.render("listings/about.ejs");
});

// app.get("/download-resume", (req, res) => {
//   const filePath = path.join(__dirname, "public", "resume.pdf");
//   res.download(filePath);
// });



app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    let { statuscode = 500, message = "something went wrong" } = err;
    res.render("err.ejs", { statuscode, message });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log("server is listening to port 8080");
});

const User=require("../models/user.js")
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const userController=require("../controllers/user.js");


module.exports.rendersignup=(req,res)=>
{
    res.render("users/signup.ejs");
}

module.exports.signup=async(req,res)=>{
    try{
        let{username,email,password}=req.body;
        const newUser=new User({email,username});
        const  registerdUser=await User.register(newUser,password);
        // console.log(registerdUser);
        req.login(registerdUser,(err)=>
        {
            if(err)
            {
                return next(err)
            }
            req.flash("success","Welcome To Your Home");
            res.redirect("/listings");
        });
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
};

module.exports.renderlogin=(req,res)=>
{
    res.render("users/login.ejs");
}

// controllers/user.js
module.exports.login = (req, res) => {
    req.flash("success", "Welcome back!");

    console.log("➡️ Redirect URL in session:", req.session.returnTo);

    const redirectUrl = req.session.returnTo || "/listings";
    delete req.session.returnTo;

    res.redirect(redirectUrl);
};



module.exports.logout=(req,res,next)=>
{   
    req.logout((err)=> {
    if(err){
       return next(err);
    }
    req.flash("success","Hope you like this ,Please Re visit again");
    res.redirect("/listings");
    })
}
var express=require("express");
var router =express.Router();
var passport=require("passport");
var User    =require("../models/user");
//===========
//Auth ROUTES
//===========
router.get("/", function(req, res){
    res.render("landing");
});

//show signup form
router.get("/register",function(req, res) {
    res.render("register");
})
//register logic
router.post("/register",function(req, res) {
    var newUser=new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            req.flash("error",err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success","Welcome to YelpCamp " +user.username);
            res.redirect("/campgrounds");
        });
    });
});

//LOGIN ROUTES
router.get("/login",function(req,res){
    res.render("login");
})

router.post("/login",passport.authenticate("local",
{   
    successRedirect:"/Campgrounds",
    failureRedirect:"/login"
}),function(req,res){
});

//LOGOUT Routes
router.get("/logout",function(req, res) {
    req.logout();
    req.flash("success","logged you out!");
    res.redirect("/campgrounds");
})

module.exports=router;
var middlewareObj={};
var Campgrounds=require("../models/compgrounds");
var Comment=require("../models/comment");

middlewareObj.checkCampgroundOwnership=function (req,res,next){
    if(req.isAuthenticated()){
        Campgrounds.findById(req.params.id,function(err,foundcamp){
            if(err||!foundcamp){
                req.flash("error","Database error")
                res.redirect("back");
            }
            else{
                if(foundcamp.author.id.equals(req.user.id)||req.user.isAdmin){
                    req.campground=foundcamp;
                    next();
               }
                else{
                    req.flash("error","You do not have permission to do that!");
        
                    res.redirect("back");
                }
            }
        });   
    }
    else{
        req.flash("error","you need to be logged in to do that!");
        res.redirect("back");
        res.send("You NEED TO BE LOGGED IN!!!")
    }
}

middlewareObj.checkCommentOwnership=function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundcomment){
            if(err||!foundcomment){
                console.log(err);
                req.flash("error", "(Database error) with comment")
                res.redirect("back");
            }
            else{
                if(foundcomment.author.id.equals(req.user.id)||req.user.isAdmin){
                    req.comment=foundcomment;
                    next();
               }
                else{
                    req.flash("error","you donot have permission!");
                    res.redirect("back");
                }
            }
        });   
    }
    else{
        req.flash("error","You need to be logged in first!")
        res.redirect("back");
    }
}
middlewareObj.isLoggedIn=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    } 
    req.flash("error","Please login first!");
    res.redirect("/login");
}

module.exports=middlewareObj;
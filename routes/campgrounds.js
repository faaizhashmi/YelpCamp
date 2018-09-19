var express=require("express");
var router=express.Router();
var Campgrounds=require("../models/compgrounds");
var middleware =require("../middleware");
// router.get("/",function(req,res){
//     res.render("landing");
// })      
//INDEX
router.get("/",function(req,res){
    Campgrounds.find({},function(err,allcamps){
      if(err){
          console.log(err);
      } 
      else{
          res.render("campgrounds/index",{campgrounds:allcamps,currentUser:req.user});
      }
    });
})
//CREATE- add new campground to DB
router.post("/",function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var desc=req.body.description;
    var price=req.body.price;
    var author={
        id:req.user._id,
        username:req.user.username
    }
    var newcampground= {name:name,price:price,image:image,description:desc,author:author};
    Campgrounds.create(newcampground,function(err,newlycreated){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/campgrounds");           
        }                                           
    });                                             
});                                                 
//NEW- show form to create new campground               
router.get("/new",middleware.isLoggedIn,function(req,res){       
    res.render("campgrounds/new.ejs");                                              
})                                                              
//SHOW-                                                         
router.get("/:id",function(req,res){                   
    Campgrounds.findById(req.params.id).populate("comments").exec(function(err,foundcamp){
        if(err||!foundcamp){
            req.flash('error',"Sorry that campground doesnot exist!")
            console.log(err);                           
            return res.redirect('/campgrounds');
        }                                               
        else{    
           // console.log(foundcamp);                           
            res.render("campgrounds/show",{campgrounds:foundcamp})  
        }                                               
    })                                                   
})
//EDIT
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req, res) {
        // Campgrounds.findById(req.params.id,function(err,foundcamp){
        //   res.render("campgrounds/edit",{campgrounds:foundcamp});
        // })
        res.render("campgrounds/edit", {campgrounds: req.campground});
});                 
router.put("/:id",function(req,res){
    Campgrounds.findByIdAndUpdate(req.params.id,req.body.campgrounds,function(err,foundcamp){
        if(err){    
            console.log(err);
            res.redirect("/campgrounds");
        }           
        else{       
            res.redirect("/campgrounds/"+req.params.id);
        }           
    })              
})                      
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campgrounds.findByIdAndDelete(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds");
        }               
    })                  
})                      

//comment NEW
module.exports=router;
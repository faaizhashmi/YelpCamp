var express         =require("express"),
    seedDB          =require("./seeds"),
    flash           =require("connect-flash"),
    mongoose        =require("mongoose"),
    bodyParser      =require("body-parser"),
    passport        =require("passport"),
    methodOverride  =require("method-override"),
    LocalStrategy   =require("passport-local"),
    Campgrounds     =require("./models/compgrounds"),
    Comment         =require("./models/comment"),
    User            =require("./models/user"),
    app             =express();

var commentRoutes =require("./routes/comments"),
    campgroundRoutes=require("./routes/campgrounds"),
    indexRoutes      =require("./routes/index");
mongoose.connect("mongodb://localhost/yelp_camp_v10");            
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public")); 
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
//  seedDB();
 
 //PASSPORT CONFIGURATION
 app.use(require("express-session")({
     secret:"This is a secret!",
     resave:false,
     saveUninitialized:false

 }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash());
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
}) 

app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(process.env.PORT,process.env.IP,function(){  
    console.log("server has started!!!");               
})                                                      
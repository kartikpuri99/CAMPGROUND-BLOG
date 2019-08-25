var express=require("express");
var app=express();
var bodyparser=require("body-parser");
var mongoose=require("mongoose");
var flash=require("connect-flash");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var methodOverride=require("method-override");
var Campground=require("./models/campground");
var Comment=require("./models/comment");
var User=require("./models/user");
var seedDB=require("./seeds");

//requiring routes
var commentRoutes=require("./routes/comments");
var campgroundRoutes=require("./routes/campgrounds");
var indexRoutes=require("./routes/index");




mongoose.set('useNewUrlParser', true);
//mongoose.connect("mongodb://localhost/yelp_camp");
const uri = "mongodb+srv://kartikpuri:kartik720@yelpcamp-pp6ew.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(uri);
app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); //seed the database

//PASSPORT CONFIG
app.use(require("express-session")({
    secret:"yelpcamp is the best",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    
    next();
})

app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(3000,function(){
    console.log("YelpCamp server has started !");
});
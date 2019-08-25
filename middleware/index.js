var Campground=require("../models/campground");
var Comment=require("../models/comment");


//all the middleware go here
var middlewareObj={};

middlewareObj.checkCampgroundOwnership=function(req,res,next){
        //is user logged in
        if(req.isAuthenticated()){
            
            Campground.findById(req.params.id,function(err,foundCampground){
                if(err){
                    req.flash("error","campground not found");
                    res.redirect("back");
                }else{
                    //does user own the campground
                    if(foundCampground.author.id.equals(req.user._id)){   //currently logged on user id=campground authors id
                        next();
                    }else{
                        req.flash("error","You do not have permission to do that");
                        res.redirect("back");
                    }
                }
            })
        }else{
            req.flash("error","You need to be logged in to do that");
            res.redirect("back");
        }
        //otherwise redirect
        //if not,redirect
    }

middlewareObj.checkCommentOwnership=function(req,res,next){
    //is user logged in
    if(req.isAuthenticated()){
        
        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err){
                res.redirect("back");
            }else{
                //does user own the comment
                if(foundComment.author.id.equals(req.user._id)){   //currently logged on user id=campground authors id
                    next();
                }else{
                    req.flash("error","You don't have permission to do that");
                    res.redirect("back");
                }
            }
        })
    }else{
        req.flash("error","You need to be logged in");
        res.redirect("back");
    }
    //otherwise redirect
    //if not,redirect
}

middlewareObj.isLoggedIn=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in!");//in this error is just a name of key it can be anything it is not a value
    res.redirect("/login");
}


module.exports=middlewareObj;
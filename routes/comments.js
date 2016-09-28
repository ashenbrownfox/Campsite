var express = require("express");
var router = express.Router();
var CampgroundDB = require("../models/campground");
var Comment = require("../models/comment");
//=====================================
//COMMENTS ROUTES
//=====================================

//comments new
router.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    CampgroundDB.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground : campground});
        }
    });
   
});


//comments create
router.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
    CampgroundDB.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
           console.log(req.body.comment);
           Comment.create(req.body.comment, function(err, comment){
               if(err){
                   console.log(err);
               } else {
                   //add username and id to comments
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   console.log("New Comment user: "+req.user.username);
                   //save comment
                   comment.save();
                   campground.comments.push(comment);
                   campground.save();
                   res.redirect("/campgrounds/" + campground._id);
               }
           });
       }
    });
    //create new comment
    //connect new comment to campground
    //redirect campground show page
})

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
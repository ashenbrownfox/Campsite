var express = require("express");
var router = express.Router();
var CampgroundDB = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware/index.js");
//=====================================
//COMMENTS ROUTES
//=====================================

//comments new
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res){
    CampgroundDB.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground : campground});
        }
    });
   
});


//comments create
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res){
    CampgroundDB.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
           console.log(req.body.comment);
           Comment.create(req.body.comment, function(err, comment){
               if(err){
                   req.flash("error", "Campground not found");
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
                   req.flash("success", "Comment successfully added!");
                   res.redirect("/campgrounds/" + campground._id);
               }
           });
       }
    });
    //create new comment
    //connect new comment to campground
    //redirect campground show page
})

//COmments edit route
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership,function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

//COMMENT UPDATE put request
//campgrounds/:id/comments/:comment_id
router.put("/campgrounds/:id/comments/:comment_id", function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/", + req.params.id);
        }
    });
});

//Comment DESTROY ROUTE
//route /campgrounds/Lid/comments/:comments_id
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment Deleted!");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});




module.exports = router;
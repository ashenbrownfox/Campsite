var express = require("express");
var router = express.Router();
var CampgroundDB = require("../models/campground");
//=====================================
//CAMPGROUND OBJECT ROUTES
//=====================================

//INDEX - show all campgrounds
router.get("/campgrounds", function(req,res){
    CampgroundDB.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
});

//NEW ITEM PAGE ROUTE shows the form, and then the form submits a post request
router.get("/campgrounds/new", isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//SHOW - shows more info about one campground
router.get("/campgrounds/:id", function(req, res){
    CampgroundDB.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//CREATE - add new campground to DB
router.post("/campgrounds", isLoggedIn, function(req,res){
   //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.desc;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description: desc, author: author};
   
   CampgroundDB.create(newCampground, function(err, newlyCreated){
       if(err){
           console.log(err);
       } else {
           //console.log("Successfully added "+newCampground.name);
           console.log(newlyCreated);
           res.redirect("/campgrounds");
       }
   });
});

//EDIT PAGE ROUTE
router.get("/campgrounds/:id/edit", checkCampgroundOwnership, function(req, res){
        CampgroundDB.findById(req.params.id, function(err, foundCampground){
            res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//UPDATE ROUTE
router.put("/campgrounds/:id", function(req, res){
   //find and update the correct campgro
   CampgroundDB.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds/" +req.params.id);
       }
   });
});

//DESTROY ROUTE
router.delete("/campgrounds/:id", checkCampgroundOwnership, function(req, res){
    CampgroundDB.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next){
    if(req.isAuthenticated()){
        CampgroundDB.findById(req.params.id, function(err, foundCampground){
            if(err){
                res.redirect("back");
            } else {
                //check if User owns the object?
                console.log(foundCampground.author.id); //mongoose object
                console.log(req.user._id); //string
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
                
            }
    });
            
    } else {
        res.redirect("back");
    }
}

module.exports = router;
var express = require("express");
var router = express.Router();
var CampgroundDB = require("../models/campground.js");
var Comment = require("../models/comment");
var passport = require("passport");
var User = require("../models/user");

//root route
router.get("/", function(req,res){
   res.render("landing");
});


//======================
//AUTHENTICATION ROUTES
//======================
//show the register form
router.get("/register", function(req,res){
   res.render("register"); 
});

//Handles Sign Up Logic
router.post("/register", function(req,res){
    //res.send("Signing you up.....");
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        
        passport.authenticate("local")(req,res, function(){
            res.redirect("/campgrounds"); 
        });
    });
});

//Handles login logic
router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
    
});

//logout route
router.get("/logout", function(req, res){
   req.logout();
   res.redirect("/campgrounds");
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
var express= require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");
    
mongoose.connect("mongodb://localhost/camp");    
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
/* global campgrounds */

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var CampgroundDB = mongoose.model("Campground", campgroundSchema);


app.get("/", function(req,res){
   res.render("landing");
});


app.get("/campgrounds", function(req,res){
        CampgroundDB.find({}, function(err, allCampgrounds){
            if(err){
                console.log(err);
            } else {
                res.render("index", {campgrounds: allCampgrounds});
            }
        });
});

//shows the form, and then the form submits a post request
app.get("/campgrounds/new", function(req, res){
    res.render("new.ejs");
});

app.get("/campgrounds/:id", function(req, res){
    CampgroundDB.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            res.render("show", {CampgroundDB: foundCampground});
        }
    });
   
   res.render("show"); 
});

app.post("/campgrounds", function(req,res){
   //get data from form and add to campgrounds array
   var name = req.body.name;
   var image = req.body.image;
    var desc = req.body.image;
   var newCampground = {name: name, image: image, description: desc}
   
   CampgroundDB.create(newCampground, function(err, newlyCreated){
       if(err){
           console.log(err);
       } else {
           console.log("Successfully added "+newCampground.name);
           res.redirect("/campgrounds");
       }
   });
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Server has started!!");
});
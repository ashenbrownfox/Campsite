var express= require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    CampgroundDB = require("./models/campground"),
    Comment = require("./models/comment"),
    //User = require("./models/user"),
    seedDB = require("./seeds");
    
    seedDB();
    
mongoose.connect("mongodb://localhost/camp");    
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");


//Landing Page, like main page
app.get("/", function(req,res){
   res.render("landing");
});


//INDEX - show all campgrounds
app.get("/campgrounds", function(req,res){
        CampgroundDB.find({}, function(err, allCampgrounds){
            if(err){
                console.log(err);
            } else {
                res.render("campgrounds/index", {campgrounds: allCampgrounds});
            }
        });
});

//shows the form, and then the form submits a post request
app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new");
});

//SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
    CampgroundDB.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

app.post("/campgrounds", function(req,res){
   //get data from form and add to campgrounds array
   var name = req.body.name;
   var image = req.body.image;
    var desc = req.body.desc;
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


//=====================================
//COMMENTS routes
//=====================================
app.get("/campgrounds/:id/comments/new", function(req, res){
    
    //find campground by id
    
    CampgroundDB.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground : campground});
        }
    });
   
});

app.post("/campgrounds/:id/comments", function(req, res){
    //look up campground using ID
    
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



app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Server has started!!");
});
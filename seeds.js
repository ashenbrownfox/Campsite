//Error driven development
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");


var data = [
        {
            name: "Honda Civic", 
            image: "http://automobiles.honda.com/images/2016/civic-sedan/overview-colors/WO.jpg",
            description: "Honda's new civic just set a new plat"
        },
        {
            name: "Mazda 3", 
            image: "http://media.caranddriver.com/images/12q3/463432/2014-mazda-3-rendering-and-information-news-car-and-driver-photo-475717-s-450x274.jpg",
            description: "Truly the driver's car"
        },
        {
            name: "Ford Focus", 
            image: "http://www.ford.com/ngbs-services/resources/ford/focus/2016/highlights/fcs16_highlight_lg_st.jpg",
            description: "Zesty Fun with improved looks"
        }
    ];


//wipe everything from database
function seedDB(){
        Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("Removed all campgrounds!");
            
             //add a couple new campgrounds
            data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                    if(err){
                        console.log(err);
                    } else {
                        console.log("added a campground");
                        Comment.create(
                            {
                                text: "Great car! Just needs internet",
                                author: "Homer Simpson"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("created new comment");
                                }
                                
                            });
                    }
                });
            });
        });
        
       
}

module.exports = seedDB;
//Error driven development
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");


var data = [
        {
            name: "Honda Civic", 
            image: "http://automobiles.honda.com/images/2016/civic-sedan/overview-colors/WO.jpg",
            description: "Honda's new civic just set a new plateau. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
        },
        {
            name: "Mazda 3", 
            image: "https://www.mazdausa.com/siteassets/vehicles/2016/m3h/vlp/gallery/m3h-soulred-forest-mde-m3h-gallery.jpg",
            description: "Truly the driver's car. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
        },
        {
            name: "Ford Focus", 
            image: "http://www.ford.com/ngbs-services/resources/ford/focus/2016/highlights/fcs16_highlight_lg_st.jpg",
            description: "Zesty Fun with improved looks. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
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
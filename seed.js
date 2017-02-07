var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
        {   
            name : "Cloud's Rest", 
            image: "https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg",
            description : "tandard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only fi"
        },
        {   
            name : "Heaven's Moon", 
            image: "https://farm9.staticflickr.com/8422/7842069486_c61e4c6025.jpg",
            description : "Your dreams will come true"
        },
        {   
            name : "The Horizon", 
            image: "https://farm9.staticflickr.com/8673/15989950903_8185ed97c3.jpg",
            description : "Your horizon will exceed your excepctations"
        },
    ];

function seedDB(){
    // Remove all campgrounds
    Campground.remove({},function(err){
        if(err){
            console.log(err);
        } else{
            // Add a few campgrounds
            addCampgrounds();
            console.log("Removed all campgrounds");
        }
    });
    
    
    
    // Add a few comments
}

function addCampgrounds(){
    data.forEach(function(seed){
               Campground.create(seed, function(err, campground){
                   if(err){
                       console.log(err);
                   } else {
                       console.log("Added the campground "+campground);
                       
                       // Create a comment
                       Comment.create(
                           {
                                text: "I want to go there!",
                                author: "John Petroch"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("Created a new comment");
                                }
                            }
                       );
                   }
               }) ;
            });
}

module.exports = seedDB; 
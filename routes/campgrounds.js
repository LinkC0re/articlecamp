var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");//it will automatically load ""../middleware/index.js" because of name index.js

router.get("/",function(req,res){
   
    Campground.find({},function (err, allCampgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/index",{campgrounds:allCampgrounds});
        }
    });
    //res.render("campgrounds",{campgrounds:campgrounds});
});

// new
router.post("/",middleware.isLoggedIn,function(req,res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var price = req.body.price;
    var imageUrl = req.body.imageUrl;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    // redirect back to campgrounds page
    var newCampground = {name:name,price:price,image:imageUrl,description:desc , author:author};
    //campgrounds.push(newCampground);
    Campground.create(newCampground, function(err, newlyCreated){
       if(err){
           console.log(err);
       } 
       else{
           res.redirect("/campgrounds");
       }
    });

});

// NEW
router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("campgrounds/new");
});

// SHOW
router.get("/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec( function(err,foundCampground){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/show",{campground: foundCampground});
        }
    });
});

// EDIT
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findById(req.params.id,function(err,foundCamp){
       if(err){
           res.redirect("/campgrounds");
       } else {
           res.render("campgrounds/edit",{campground:foundCamp});
       }
    });
});

// UPDATE
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground, function(err,updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

// DESTROY
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    })
});

// function isLoggedIn(req,res,next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// };

// function checkAuthorization(req,res,next){
//     if(req.isAuthenticated()){
//         Campground.findById(req.params.id,function(err,foundCamp){
//             if(err){
//                 res.redirect("back");
//             } else {
//                 if(foundCamp.author.id.equals(req.user._id)){
//                     next();
//                 } else {
//                     res.redirect("back");
//                 }
//             }
//         });
//     } else {
//         res.redirect("back");
//     }
// }

module.exports = router;
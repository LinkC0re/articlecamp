var express = require("express");
var router = express.Router({mergeParams:true}); //so we can access the params like "id" from "/campgrounds/:id/"
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require('../middleware');

// comments new

router.get("/new",middleware.isLoggedIn,function(req,res){
    //find campground by id and send hte information
    Campground.findById(req.params.id,function(err, campground){
        if(err){
            console.log(err);
            req.flash("error","Error: "+err.message);
        } else {
            res.render("comments/new",{campground: campground});
        }
    });
});

// comments create
router.post("/",middleware.isLoggedIn,function(req,res){
   // look up campground using ID
   Campground.findById(req.params.id,function(err, campground) {
       if(err){
           console.log(err);
       } else {
           //create new comment
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                    req.flash("error","Error: couldn't create comment : "+err.message);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
           //connect new comment to campground
           
           //redirect campground show page
       }
   });
   
});

// EDIT
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            res.redirect("back");
        }else {
            res.render("comments/edit",{campground_id:req.params.id,comment:foundComment});
        }
    })
});

// UPDATE
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err){
            req.flash("error","Error: could not update comment : "+err.message);
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});

// DESTROY
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            req.flash("error","Error: could not destroy comment : "+err.message);
            res.redirect("back");
        } else {
            req.flash("success","Comment deleted");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

// function isLoggedIn(req,res,next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// };

// function checkAuthorization(req,res,next){
//     if(req.isAuthenticated()){
//         Comment.findById(req.params.comment_id,function(err,foundComment){
//             if(err){
//                 res.redirect("back");
//             } else {
//                 if(foundComment.author.id.equals(req.user._id)){
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
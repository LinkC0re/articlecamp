// all the middleware goes here
var middlewareObj={};
var Article = require("../models/article");
var Comment = require("../models/comment");

middlewareObj.checkArticleOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Article.findById(req.params.id,function(err,foundArticle){
            if(err){
                req.flash("error","Article not found");
                res.redirect("back");
            } else {
                if(foundArticle.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error","You don't have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err){
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error","You don't have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in!")
    res.redirect("/login");
};

module.exports =middlewareObj;
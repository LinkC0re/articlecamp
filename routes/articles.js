var express = require("express");
var router = express.Router();
var Article = require("../models/article");
var middleware = require("../middleware");//it will automatically load ""../middleware/index.js" because of name index.js

router.get("/",function(req,res){
   
    Article.find({},function (err, allArticles){
        if(err){
            console.log(err);
        }
        else{
            res.render("articles/index",{articles:allArticles});
        }
    });
    //res.render("articles",{articles:articles});
});

// new
router.post("/",middleware.isLoggedIn,function(req,res){
    // get data from form and add to articles array
    var name = req.body.name;
    var imageUrl = req.body.imageUrl;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    // redirect back to articles page
    var newArticle = {name:name,image:imageUrl,description:desc , author:author};
    //articles.push(newArticle);
    Article.create(newArticle, function(err, newlyCreated){
       if(err){
           console.log(err);
       } 
       else{
           res.redirect("/articles");
       }
    });

});

// NEW
router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("articles/new");
});

// SHOW
router.get("/:id",function(req,res){
    Article.findById(req.params.id).populate("comments").exec( function(err,foundArticle){
        if(err){
            console.log(err);
        }
        else{
            res.render("articles/show",{article: foundArticle});
        }
    });
});

// EDIT
router.get("/:id/edit",middleware.checkArticleOwnership,function(req,res){
    Article.findById(req.params.id,function(err,foundArticle){
       if(err){
           res.redirect("/articles");
       } else {
           res.render("articles/edit",{article:foundArticle});
       }
    });
});

// UPDATE
router.put("/:id",middleware.checkArticleOwnership,function(req,res){
    Article.findByIdAndUpdate(req.params.id,req.body.article, function(err,updatedArticle){
        if(err){
            res.redirect("/articles");
        } else {
            res.redirect("/articles/"+req.params.id);
        }
    });
});

// DESTROY
router.delete("/:id",middleware.checkArticleOwnership,function(req,res){
    Article.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/articles");
        } else {
            res.redirect("/articles");
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
//         Article.findById(req.params.id,function(err,foundarticle){
//             if(err){
//                 res.redirect("back");
//             } else {
//                 if(foundarticle.author.id.equals(req.user._id)){
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
var mongoose = require("mongoose");

//SCHEMA SETUP
var articleSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author: {
      id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
      },
      username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment" // name of the model
        }    
    ]
});

module.exports =  mongoose.model("Article",articleSchema);
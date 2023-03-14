const mongoose = require("mongoose")
const postSchema = new mongoose.Schema({
    
    title : {
        type : String,
        required : true
    },
    author : {
        type : String,
        required : true
    },
    content : {
        type : String,
        required : true
    },
});

//SYNTAX = mongoose.model('collection_name' , collection_Schema);
module.exports = mongoose.model('Posts' , postSchema);
//The mongoose.model() function of the mongoose module is used to create a collection of a particular database of MongoDB.

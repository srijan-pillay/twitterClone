const mongoose = require("mongoose")

//mongoose.Schema is used to create a new object of user model (kyoki new keyword use ho rha isiliye object hi banega na yaaaaaar)

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    }

})

//SYNTAX = mongoose.model('collection_name' , collection_Schema);
module.exports = mongoose.model('User' , userSchema);
//The mongoose.model() function of the mongoose module is used to create a collection of a particular database of MongoDB.


/*The module.exports is a special object which is included in every JavaScript file in the Node.js application by default. 
The module is a variable that represents the current module, and exports is an object that will be exposed as a module.
 So, whatever you assign to module.exports will be exposed as a module.*/

const express = require("express");
const postModel = require("../model/posts");
const user = require("../model/user");
const postRouter = express.Router();






//FIND METHODS IN MONGODB = https://www.w3schools.com/nodejs/nodejs_mongodb_find.asp, https://www.softwaretestinghelp.com/mongodb/mongodb-query-document-find/



//CREATING A NEW POST
/*
1.pehle ek object bna lenge newPost ka 
2.uske baad try catch block use karenge error catch karne ke liye
3.inside try if no error then call the .save function of mongodb to save the object created nhi to send the error msg
*/
postRouter.post('/createPost',async(req,res)=>{
    //STEP - 1
    const newPost = new postModel({
        title : req.body.title,
        author : req.body.author,
        content : req.body.content
    })
    //STEP - 2 & 3
    try {
        const result = await newPost.save();
        res.status(200).send("Post Created")
        
    } catch (error) {
        res.status(400).send("error aa gya bhai " + error);
    }
})






//GET ALL POST
/* 
we have used try and catch block idhar bhi to detect error.
1. inside try we will get all the post using findOne() function and store it in result
then we will send the result
2. if there is an error we will pass it through the catch block.
*/

postRouter.get('/getAllPost',async(req,res)=>{
    //STEP - 1
    try {
        const result = await postModel.find();
        res.status(200).send(result)

    }
    //STEP - 2
    catch (error) {
        res.status(400).send("error hai bhaiya " + error )
    }
})












//GET POST BY ID

postRouter.get('/getPostById/:id',async(req,res)=>{
    const id = req.params.id; // params helps us to access any extra details mentioned in the url string of the method. jaise /getPostById/:id me params.id will access id mentioned after getpostbyid
    try {
        const result = await postModel.findById(id);
        // res.status(200).send(result) agar sirf ye likhte instead of the if else statement to bhi chl jata lekin agar id galat hoti to bhi success print hota 
        //we have written this if-else statement bcoz agar given id galat hai then we have to tell the user that no post is there
        if (result==null) {
            res.send("No post found")
        } else {
            res.status(200).send(result)
        }
    } catch (error) {
        res.status(400).send("error hai bhaiya " + error )
    }
})












//UPDATE A POST BY ID- 

/*
in this method we will use patch(which basically means to update)
1.we have used the findByIdAndUpdate method of mongoDB to find and update the post with that particular id
this method takes the id, the new data and an option as its parameter
we will be getting the id(which will be mentioned by the user in the url) again using params 
the new data entered will simply be the content of the body
and what is option here? = findByIdAndUpdate method returns the original value by default. For it to send the updated value, we will set the value of new variable to true
2.after this we hame ye bhi check karna padega ki jo id hai wo sahi hai bhi ya nhi and for that we have used if-else statment
agar result null hai mtlb id galat thi so hum kuch bhi update nhi kar paenge but in the other case we will send the msg that it was successfully updated
3.if there is an error it will be catched by the catch block
*/

postRouter.patch('/updatePost/:id',async(req,res)=>{
    //STEP - 1
    try {
        const id = req.params.id;
        const newData = req.body;
        const option = {new:true};
        const result = await postModel.findByIdAndUpdate(id,newData,option);

        //STEP - 2
        if (result==null) {
            res.send("No post found")
        } else {
            res.status(200).send("Post was Successfully Updated!!" + result)
        }
        

    } 
    //STEP - 3
    catch (error) {
        res.status(400).send("Kuch to error hai mere bhai!!");
    }
})












//DELETE A POST BY ID
/*
We have used the delete method here
1. idhar bhi the first step is the one which will get us the id from the url
2. we will find the post with that id using findByIdAndDelete method of mongodb
3. we will check if the id is correct like above
4. will use the catch statement in case of errors
*/
postRouter.delete('/deletePost/:id',async(req,res)=>{
    //STEP - 1
    try {
        const id = req.params.id;
        //STEP - 2
        const result = await postModel.findByIdAndDelete(id);
        //STEP - 3
        if (result==null) {
            res.send("No post found")
        } else {
            res.status(200).send("Post was Successfully deleted!!")
        }
        
    } 
    //STEP - 4
    catch (error) {
        res.status(400).send("Error aa gya yaaaaaaaaaaaaar!!!!!!!")
    }
    

})


module.exports = postRouter;
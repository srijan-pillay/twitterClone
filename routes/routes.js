const express = require("express");

const jwt = require("jsonwebtoken");


const bcrypt = require("bcrypt");

//DIFFERENCE BETWEEN BCRYPT AND BCRYPTJS - bcrypt is written in c++ whereas bcryptjs is written in javascript
//https://stackoverflow.com/questions/54674387/how-do-nodes-bcrypt-and-bcryptjs-libraries-differ

const joi = require("joi");
const userModel = require("../model/user");
const router = express.Router();

// SYNTAX = router.method_name("functionality_name_with_slash",callback_function)






/*
Register User Funcitonality - 
1.Pehle joi object create karenge taaki usme validation laga sake.
2.Fir method create karenge and usme pehle check karenge ki email already exist karta hai ya nhi.
yaha pe we have used the findOne method to check if emailalready exists in the user model. if not 
then we will create a new userModel object 
2.(but with password hashing) - for password hashing we have used bcrypt library. isme pehle we will generate a random
salt using bcrypt's gensalt method and then hash the password along with adding the salt to it.

(https://heynode.com/blog/2020-04/salt-and-hash-passwords-bcrypt/) - best website to understand hashing through bcrypt

3.We have used try and catch block to check for validation. error tab generate hoga agar validation me dikkat hai
agar error hua to response me error send ho jaega nhi to we will call the .save() method to save the details of the 
userModel object 
*/

//STEP - 1
const regUserSchema = joi.object({
    username : joi.string().required(),
    email : joi.string().required().email(),
    password : joi.string().required().min(8)
})
 

router.post('/registerUser',async(req, res)=>{
    //STEP - 2 (witout password hashing)
    /*const emailHai =await userModel.findOne({
        email : req.body.email
    })
    if(emailHai){
        return res.status(400).send("Email to hai bhaiya, Doosra daalo!!") 
    }
    const user = new userModel({
        username : req.body.username,
        email : req.body.email,
        password : req.body.password,

    })*/

    //STEP - 2 (with password hashing)
    const emailHai =await userModel.findOne({
        email : req.body.email
    })
    if(emailHai){
        return res.status(400).send("Email to hai bhaiya, Doosra daalo!!") 
    }

    const salt = await bcrypt.genSalt(10);  
    //gensalt is the method used for creating salt
    //idhar 10 is the salt round (jitna zyada salt round utna zyada hashing me time and utna hi difficult it gets for predicting)
    const hashedPass = await bcrypt.hash(req.body.password , salt);
    //hashedpass will store the hashed password with the salt added to it

    const user = new userModel({
        username : req.body.username,
        email : req.body.email,
        password : hashedPass,  // if we were not hashing the password we would have written password : req.body.password like above but now we want the hashedpass to get stored 

    })

    //STEP - 3
    try {
        const{error} =await regUserSchema.validateAsync(req.body)
        if (error) {
            res.send(error)
        } else {
            const result =await user.save()
            res.status(200).send("Mubarak ho!! User register ho gya bhaiya!!")  
        }
        
    } catch (error) {
        res.status(400).send(error)
    }
    
})  







/*Login User Funcitonality

1. as we have done in registeUser, we will create a joi object for loginUser so that validation can be applied
2. then using try catch block we check for validation 
3. uske baad we will check if the email entered by the user is in the database or not, agar nhi to error send kar denge
otherwise we will move to step 4
4. now we will check if the password entered by the user is same as the one in the database or not
iske liye we will encrypt the password entered by the user and compare it with the already encrypted password in the database
(all of this work is done by the compare function of bcrypt)
5. after checking if the password is valid generate a jwt token otherwise send an error message
*/


//STEP - 1
const loginUserSchema = joi.object({
    email : joi.string().required().email(),
    password : joi.string().required().min(8)
})

router.post('/login',async (req,res)=>{
    //STEP - 2
    try {
        const{error} = await loginUserSchema.validateAsync(req.body)
        }
        catch(error)
        {
            res.status(400).send(error);
        }

        //STEP - 3

        const user = await userModel.findOne({
            email : req.body.email
        })
        if(!user)
        {
            res.status(400).send("Email galat hai bhaiya!! Check karo!!")
        }

        //STEP - 4
        
        const validPass =  await bcrypt.compare(req.body.password,user.password) //The compare function simply pulls the salt out of the hash and then uses it to hash the password and perform the comparison.
        
        //STEP - 5

        //HOW IS JWT TOKEN WORKING AND WHY DO WE NEED IT?
        /*we do not have to login again and again everytime we start our server which can be done by json web token
        basically hum token generate karne ke liye koi bhi user data(preferrably id) lete hai and ek token secret
        lete hai. ab jwt.sign method se jo bhi data liya hai use token secret se sign kar dete hai and we pass it 
        as a msg nhi to in the header*/

        if(validPass)
        {
            const tokenSecret = process.env.Token_Secret;
            const data = {
                _id : user._id  // idhar pe we have used underscore(_) bcoz mongodb me user id is stored as (_id)
            }
            const token = jwt.sign(data,tokenSecret);
            res.send(token);
        }
        else
        {
            res.status(400).send("Kuch to gadbad hai bhaiya")
        }
    
})



module.exports = router;
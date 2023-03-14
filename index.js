require("dotenv").config();
//dotenv is used to load environment variable from .env file
//config() method - the config method takes a .env file path as an argument, it parses it and sets environment vars defined in that file in process. env

const mongoose = require("mongoose");

const express = require("express")

const app = express();

const cors = require("cors");

app.use(express.json()) //express.json() is a built in middleware function in Express starting from v4.16.0. It parses incoming JSON requests and puts the parsed data in req.body.
const routes = require("./routes/routes")
app.use('/twitterCloneUser',routes);  // app.use() is used to add middleware layers //Each middleware layer is essentially adding a function that specifically handles something to your flow through the middleware. //https://stackoverflow.com/questions/11321635/nodejs-express-what-is-app-use

const postRoutes = require("./routes/postRoutes")
app.use('/twitterClonePost',postRoutes);


//////////////////CORS WALA PART////////////////////////////////

/*-> WHY DOES CORS ERROR OCCUR?

cors stands for cross origin resource sharing. cors error occurs when we try to do a cross origin connection. mtlb 2 alag alag server ko aapas me connect karna
it is allowed to connect client and server having same origin but jaise hi dono ka origin change hota hai cors error aa jata hai (https://www.section.io/engineering-education/how-to-use-cors-in-nodejs-with-express/#:~:text=CORS%20stands%20for%20Cross%2DOrigin,origins%20can%20access%20the%20API.)
inside the double quotes below we will put the address in which we will host our front-end*/ 


app.use(cors({ 
    origin : ""
}));


/////////////////////////////////////////////////////////////////

////////////DATABASE CONNECT KARNE WALA PART/////////////////////

const connectionString = process.env.DATABASE_URL; //process.env helps us to access the variables in the .env file

mongoose.connect(connectionString); //.connect helps us to establish a connection between the server and the database

const db = mongoose.connection;  //db will store the value of connection events and will be used in the code below

// both 'connected' and 'error' are connection events that gets triggered when something happens to the connection

db.once('connected',()=>{   //Emitted when Mongoose successfully makes its initial connection to the MongoDB server, or when Mongoose reconnects after losing connectivity.
    console.log("database connected")
})

db.on('error',(err)=>{   //Emitted if an error occurs on a connection
    console.log("connection failed " + err);
})

////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////
/* -> SYNTAX FOR GET FUNCTION - app.get( path, callback ) 
   -> Use - used for binding middleware to your application
   -> In the code below (line 12 - 14) we have named the path "/" and when this path is called the callback function will print the msg in console
   -> But this will not send a request to the server for printing something and so we will not receive a response in return
   -> For that we will have to use req,res and also use the send response method (shown from line 16)
   -> geeksforgeeks.org/express-js-app-get-request-function/*/

// app.get("/",()=>{
//     console.log("hello duniya");  
// })

// app.get("/",(req,res)=>{
//     res.send("hello duniya");   // this will print the response in thunderclient instead of console.
// })

////////////////////////////////////////////////////////////////

/* -> SYNTAX FOR LISTEN FUNCTION - app.listen([port[, host[, backlog]]][, callback]) 
   -> Use - It is used to bind the connection between the host and the port (https://www.geeksforgeeks.org/express-js-app-listen-function/)*/

   app.listen(3000,()=>{                      
    console.log("server has started")
})

////////////////////////////////////////////////////////////////
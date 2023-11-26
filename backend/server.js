import express from 'express';
import session from "express-session";
import dotenv from "dotenv";
import bodyparser from "body-parser";
import passport from "passport";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

import connectDB from './config/db.js'
import {upload} from './utils/uploadImage.js'
import {verifyToken} from './utils/verifyToken.js'
import {addPet,getAllPets,getOwnPets,addWishList,getWishListed,getSearched} from './controllers/petPosts.js';
import {registerUser,loginUser} from './controllers/userController.js';


import connectCloudinary from './config/cloudinary.js'




dotenv.config()
connectDB();
connectCloudinary();
const app = express()
const PORT = process.env.PORT || 3001;

app.use(bodyparser.urlencoded({extended:true}));


app.use(cors()); 



app.use(express.json());
app.use(passport.initialize());
app.use(session({
    secret:process.env.SECRETKEY ,
    resave:false,
    saveUninitialized:false
  }));
app.use(passport.session());


    

app.get("/",(req,res)=>{
    res.send("Hello");
    console.log("Hi")
})

app.post("/addPet/:uid",verifyToken,upload.single("file"),addPet);

app.post("/addWish/:uid/:pid",verifyToken,addWishList);

app.get("/wishlisted/:uid",verifyToken,getWishListed);

app.get("/pets/:uid",verifyToken,getOwnPets);

app.get("/allPets",getAllPets);


app.get("/search/:name",verifyToken,getSearched);


app.post("/login",loginUser);

app.post("/register",registerUser);



app.listen(PORT, function(req,res) {
    console.log("Server is running on Port: " + PORT);
  });
  
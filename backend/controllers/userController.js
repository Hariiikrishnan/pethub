import express from 'express';
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { v4 as uuidv4 } from "uuid";
import asyncHandler from "express-async-handler";
import bodyparser from "body-parser";
import passport from "passport";

const app = express();
app.use(bodyparser.urlencoded({ extended: true }));



const registerUser = asyncHandler(async(req,res)=>{
    User.register(
        { u_id: uuidv4(), username: req.body.username},
        req.body.password,
        function (err, user) {
          if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
          } else {
            passport.authenticate("local")(req, res, function () {
              jwt.sign({ user }, process.env.SECRETKEY, (err, token) => {
                res.json({ token: token, user: user });
              });
            });
          }
        }
      );
});


const loginUser = asyncHandler(async(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const user = new User({
      username: username,
      password: password,
    });

    // console.log(user);
  
    req.login(user, function (err) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      } else {
        passport.authenticate("local")(req, res, function () {
            
            jwt.sign({ user }, process.env.SECRETKEY, (err, token) => {
                // console.log(token);
                User.findOne({ username: username }).then((result)=>{
                   
                        res.json({ token: token, user: result });
                        // console.log(result);
                        console.log("Here >>>")
                    
            });


            // User.findOne({username:username},(err2,result)=>{
            //     if(err2)
            // })
            // res.json({token:token})
          });
        });
      }
    });
})

export {registerUser,loginUser};
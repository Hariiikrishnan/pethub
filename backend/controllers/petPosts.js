import express from "express";

import Pet from '../models/petPost.js';
import User from "../models/userModel.js";
import uploadToCloudinary from "../utils/cloudinaryUpload.js";

import asyncHandler from "express-async-handler";
import bodyparser from "body-parser";
import { v4 as uuidv4 } from "uuid";


const app = express();
app.use(bodyparser.urlencoded({ extended: true }));

const addPet = asyncHandler(async (req, res) => {
    console.log(req.body);


    var locaFilePath = req.file.path
    var result = await uploadToCloudinary(locaFilePath)


    // console.log("doing here");
    // console.log(result.url);

    // console.log(req.params.uid);

    const pet = new Pet({
        u_id: req.params.uid,
        p_id:uuidv4(),
        petName: req.body.petName,
        holderName: req.body.petHolder,
        address: req.body.address,
        amount: req.body.amount,
        phNo: req.body.phNo,
        imgUrl: result.url,
    })


    pet.save().then((result) => {
        // console.log(result);
        res.json(result);
    }).catch((err) => {
        console.log(err);
    });

})



const getAllPets = asyncHandler(async (req, res) => {
    try {
        const results = await Pet.find();
        // console.log(results);
        res.json({ results: results });
    } catch (error) {
        console.log("Error:", error.message);
    }
})

const getOwnPets = asyncHandler(async (req, res) => {
    try {
        const results = await Pet.find({u_id:req.params.uid});
        // console.log(results);
        res.json({ results: results });
    } catch (error) {
        console.log("Error:", error.message);
    }
})

const getSearched = asyncHandler(async (req, res) => {
    console.log(req.params.name)
    try {
        const results = await Pet.find({petName:req.params.name});
        console.log(results);
        res.json({ results: results });
    } catch (error) {
        console.log("Error:", error.message);
    }
})




const getWishListed = asyncHandler(async (req, res) => {
    try {
        const results = await User.find({u_id:req.params.uid});

        console.log(results);
        console.log(results[0].wishListed);
        if(results.length!=0){
            results.map((result)=>{
                Pet.find({p_id:result.wishListed}).then((res1)=>{
                    console.log(res1);
                    res.json({ results: res1 });
                    
                })
            })
        }
    } catch (error) {
        console.log("Error:", error.message);
    }
})


const addWishList = asyncHandler(async(req,res)=>{
    console.log(req.params.pid);
    
    User.findOneAndUpdate({u_id:req.params.uid},
        {
            $push:{
                wishListed:req.params.pid
            }
        },
        { new: true, useFindAndModify: false }).then((res)=>{
            console.log(res)
        }).catch((err)=>{
            console.log(err)
        })
})


export { addPet, getAllPets , getOwnPets , getSearched , addWishList , getWishListed};
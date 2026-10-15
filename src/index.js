// require("dotenv").config();
// for debugging to connect env file
console.log(
  "mongo:", !!process.env.MONGODB_URI,
  "cloud:", !!process.env.CLOUDINARY_CLOUD_NAME,
  !!process.env.CLOUDINARY_API_KEY,
  !!process.env.CLOUDINARY_API_SECRET
);


import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";    

// import mongoose from "mongoose";
// import {DB_NAME} from "./constants.js";

// dotenv.config({
//     path: './.env'
// });


connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((error) => {
    console.error("Failure connecting to MongoDB !!!", error);
    process.exit(1); // Exit the process with an error code
  });































/*
import express from "express";
const app = express();
(async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}${DB_NAME}`);
        app.on("error",()=>{
            console.log("Error connecting to MongoDB",error);
            throw error;
        })

        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    }
    catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
})()    

*/


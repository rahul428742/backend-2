import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { DB_NAME } from '../constants.js'; 
import express from 'express'

const app = express()

dotenv.config();

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.DATABASE_URI}/${DB_NAME}`);
        console.log(`\nMongoDB Connected!! DB HOST: ${connectionInstance.connection.host}`);
        app.on("error", (error) => {
            console.log("ERR :", error);
        })
    } catch (error) {
        console.error("MongoDB Connection Error", error);
        process.exit(1);
    }
};

export default connectDB;

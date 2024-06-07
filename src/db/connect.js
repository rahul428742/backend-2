import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { DB_NAME } from '../constants.js'; // Ensure the correct path and .js extension

dotenv.config();

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.DATABASE_URI}/${DB_NAME}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`\nMongoDB Connected!! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("MongoDB Connection Error", error);
        process.exit(1);
    }
};

export default connectDB;

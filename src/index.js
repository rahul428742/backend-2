import dotenv from 'dotenv';
dotenv.config({ path: './env' }); // Make sure this points to the correct .env file location

import connectDB from './db/connect.js'; // Ensure correct path and .js extension

connectDB();

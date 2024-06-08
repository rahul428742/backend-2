import dotenv from 'dotenv';
import connectDB from './db/connect.js';
import { PORT } from './constants.js';
import express from 'express'

const app = express()

dotenv.config({ path: './env' });

connectDB()
.then(()=> {
    app.listen(PORT || 8000, () => {
        console.log(`server is running at port : ${PORT}`)
    })
})
.catch((err) => {
    console.log(`db connection failed ${err}`)
})

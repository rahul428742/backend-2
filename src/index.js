import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './db/connect.js';
import userRouter from './routes/user.routes.js';
import { PORT } from './constants.js';

dotenv.config({ path: './.env' });

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Middleware for CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

// Routes
app.use("/api/v1/users", userRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

connectDB()
    .then(() => {
        app.listen(PORT || 8000, () => {
            console.log(`Server is running at port: ${PORT}`);
        });
    })
    .catch((err) => {
        console.log(`DB connection failed: ${err}`);
    });

export { app };

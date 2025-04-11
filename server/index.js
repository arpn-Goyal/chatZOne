import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import cookieParser from 'cookie-parser';

// import routes
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js'; // assuming this is your protected route

// config
// Loads .env file contents into process.env by default. 
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

// DB connect
connectDB();

// middlewares
// It allow React to call Node APIs.
// Allow credentials in your CORS setup:
app.use(cors({
    origin: true, // your frontend origin
    credentials: true // important for sending cookies
}));
app.use(express.json()); // To Properly parse Json Data from Frontend
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', chatRoutes); 

// server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
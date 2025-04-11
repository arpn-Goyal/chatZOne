import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

const app = express();
// Loads .env file contents into process.env by default. 
dotenv.config();



app.listen(process.env.PORT, ()=>{
    console.log(`Your server is running on port: 5000`)
})
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import dbConnect from './configs/db.js';
import { inngest, functions } from "./inngest/index.js";
import { serve } from "inngest/express";
import { clerkMiddleware } from '@clerk/express'
import userRouter from './routes/userRouter.js';


const app = express() ;

await dbConnect();

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());



app.use("/api/inngest", serve({ client: inngest, functions }));

app.use('/api/user' , userRouter);



app.get('/' , (req, res) => {
    res.send('server is running')
})

const PORT = process.env.PORT || 4000

app.listen(PORT , ()=> {
    console.log(`server is running on port ${PORT}`);
})


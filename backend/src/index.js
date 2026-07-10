import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { connectDB } from "./lib/db.js";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { app,server } from "./lib/socket.js";


app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use("/profilepics", express.static("profilepics"));
app.use(express.json());
app.use(cookieParser());
const CLIENT_URL = process.env.CLIENT_URL ;
app.use(cors({
   origin: CLIENT_URL ,
   credentials: true
}));

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);


const PORT=process.env.PORT || 5005;
server.listen(PORT,()=>{
   console.log(`Server started on port ${PORT}`);
   connectDB();
});



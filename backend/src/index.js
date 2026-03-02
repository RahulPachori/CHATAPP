import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { connectDB } from "./lib/db.js";
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use("/profilepics", express.static("profilepics"));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
   origin: "http://localhost:5173",
   credentials: true
}));
app.use("/api/auth",authRoutes);
app.use("/api/message",messageRoutes);


const PORT=process.env.PORT || 5001;
app.listen(PORT,()=>{
   console.log(`Server started on port ${PORT}`);
   connectDB();
});

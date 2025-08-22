import dotenv from "dotenv";
import express from "express";
import cors from 'cors';
const app = express();
import connectDB from "./db/db.js";
import cookieParser from "cookie-parser";

dotenv.config({
    path: "./.env"
});
connectDB();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import chatRoutes from "./routes/chat.routes.js";

app.use("/api/chat", chatRoutes);


export default app;

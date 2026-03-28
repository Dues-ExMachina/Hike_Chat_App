import express from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import { connectDB } from "./lib/db.js"
import cookieParser from "cookie-parser" //helps you tp grab token from browser cookie
import cors from 'cors'
import { app, server } from "./lib/socket.js"


dotenv.config();

const PORT = process.env.PORT

//app.use(cors({ origin: "http://localhost:5173", credentials: true }))   https://hike-chat-app-git-main-dues-exmachinas-projects.vercel.app/
app.use(cors({ 
    origin: [
        "http://localhost:5173", //  for local development
        "https://hike-chat-app.vercel.app", // production Vercel URL
        "https://hike-chat-app-git-main-dues-exmachinas-projects.vercel.app" // preview Vercel URL
    ], 
    credentials: true 
}));
//this will help you to extract the data out of body
app.use(express.json({ limit: "15mb" }))

app.use(cookieParser())

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.get("/health", (req, res) => res.status(200).send("OK"));

server.listen(PORT, () => {
    console.log("server is running on PORT : " + PORT)
    //Importing database connection
    connectDB()
});

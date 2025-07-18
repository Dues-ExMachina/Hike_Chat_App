import { Server } from "socket.io";
import http from "http";
import express from "express";

//create express app
const app = express()

//create server and pass express app
const server = http.createServer(app)


//Create a SocketIO server and pass the express server init
// const io = new Server(server, {
//     cors: {
//         origin: ["http://localhost:5173"]
//     }
// })

const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:5173", //  for local development
            "https://hike-chat-app-git-main-dues-exmachinas-projects.vercel.app" // for Vercel URL here
        ]
    }
});


//this is a helper function that will return the socket id when we pass userid
export function getReceiverSocketId(userId) {
    return userSocketMap[userId]
}

//Alerting if someone gets online
//use to store online users
const userSocketMap = {

};


io.on("connection", (socket) => {
    console.log("a user connected: ", socket.id)

    //this will sync the user id and scoket id from front end authstore
    const userId = socket.handshake.query.userId
    if (userId) userSocketMap[userId] = socket.id

    //this method brodcast to every single connected user
    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on("disconnect", () => {
        console.log("a user Disconnected: ", socket.id)
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })





})

export { io, app, server }

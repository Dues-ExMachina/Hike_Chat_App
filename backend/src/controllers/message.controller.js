import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";


//Getting message sidebar
export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        //It will tell the mongoose to find all the user other then loggedin user
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        res.status(200).json(filteredUsers)
    } catch (error) {
        console.log("Error in getUsersForSidebar/messagecontroller: ", error.message);
        res.status(500).json({ message: "Internal server error" })
    }
}

//Getting the messages
export const getMessages = async (req, res) => {
    try {
        //id is what is the route name and it is his user id
        const { id: userToChatId } = req.params;
        //getting the sender user ID || it is my ID
        const myId = req.user._id

        //getting the messages
        const messages = await Message.find({
            //We want both messages from user & from sender RIGHT?
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ]
        })
        res.status(200).json(messages)
    } catch (error) {
        console.log("Error in getMessages controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}


//Sending Messages
export const sendMessages = async (req, res) => {
    try {
        //we can send either text or image here
        const { text, image } = req.body;
        //Who is going to receive the message
        const { id: receiverId } = req.params;
        //Who is going to send the message, getting user from protected route
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            //upload base64 image to cludinary
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url;
        }

        //now creating the message
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        //now save the message
        await newMessage.save();


        const receiverSocketId = getReceiverSocketId(receiverId)
        //if the user online send the message send that the user is online
        if (receiverSocketId) {
            //Io.to.emit -- broadcast to a specific user
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }

        res.status(201).json(newMessage)
    } catch (error) {
        console.log("Error in sendMessages controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
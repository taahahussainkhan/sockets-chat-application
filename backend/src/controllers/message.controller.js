import User from "../models/user.model.js";
import Message from "../models/message.models.js";



export const getUserForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } })
        res.status(200).json(filteredUsers)
    } catch (error) {
        console.log("Error in getUsers controller", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: senderId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: senderId }
            ]
        })
        res.status(200).json(messages)
    } catch (err) {
        console.log("Error in getMessages controller", err.message);
        res.status(500).json({ message: err.message });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl = null;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image, {
                folder: "messages"
            })
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            text,
            receiverId,
            image: imageUrl,
        })

        await newMessage.save();
        res.status(201).json(newMessage);
        console.log("Message sent successfully");
    } catch (error) {
        console.log("Error in sendMessage controller", error.message);
        res.status(500).json({ message: error.message });
    }
}
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";


export const getUsersForSidebar = async (req, res) => {
   try {
      const logedInUserId = req.user._id;
      const filteredusers = await User.find({ _id: { $ne: logedInUserId } }).select("-password");
      return res.status(200).json(filteredusers);
   } catch (error) {
      console.log("Error in getUsersForSidebar controller:", error.message);
      return res.status(500).json({ message: "Internal Server Error" });
   }
};

export const getMessages = async (req, res) => {
   try {
      const { id: userToChatId } = req.params;
      const myId = req.user._id;

      const messages = await Message.find({ $or: [{ senderId: myId, receiverId: userToChatId }, { senderId: userToChatId, receiverId: myId }] });
      return res.status(200).json(messages);

   } catch (error) {
      console.log("Errors in getMessages controller:", error.message);
      return res.status(500).json({ message: "Internal Server Error" });
   }
};

export const sendMessage = async (req, res) => {
   try {
      const { text, image } = req.body;
      const { id: receiverId } = req.params;
      const senderId = req.user._id;

      if (!text && !image) {
         return res.status(400).json({ message: "Message cannot be empty" });
      }

      let imageUrl = null;

      if (image) {
         const result = await cloudinary.uploader.upload(image);
         imageUrl = result.secure_url;
      }

      const newMessage = new Message({
         senderId,
         receiverId,
         text,
         image: imageUrl
      });

      await newMessage.save();

      return res.status(201).json(newMessage);

   } catch (error) {
      console.log("Error in sendMessage controller:", error.message);
      return res.status(500).json({ message: "Internal Server Error" });
   }
};
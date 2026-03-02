import mongooose from "mongoose";

const messageSchema= new mongooose.Schema(
   {
      senderId: { type: mongooose.Schema.Types.ObjectId, ref: "User" , required: true },
      receiverId: { type: mongooose.Schema.Types.ObjectId, ref: "User" , required: true },
      text: { type: String },
      image:{type: String }
   },
   { timestamps: true }
);

const Message = mongooose.model("Message", messageSchema);
export default Message;
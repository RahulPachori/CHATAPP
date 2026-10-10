import mongooose from "mongoose";

const messageSchema= new mongooose.Schema(
   {
      senderId: { type: mongooose.Schema.Types.ObjectId, ref: "User" , required: true },
      receiverId: { type: mongooose.Schema.Types.ObjectId, ref: "User" , required: true },
      text: { type: String },        // stored ENCRYPTED (ciphertext)
      iv: { type: String },          // encryption helper values (needed to decrypt)
      senderKey: { type: String },   // message key encrypted for the sender
      receiverKey: { type: String }, // message key encrypted for the receiver
      image:{type: String }
   },
   { timestamps: true }
);

const Message = mongooose.model("Message", messageSchema);
export default Message;
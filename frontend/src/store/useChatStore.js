import {create} from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { encryptText, decryptText } from "../lib/crypto";

export const useChatStore = create((set,get)=>({
   messages: [],
   users: [],
   selectedUser: null,
   isUserLoading: false,
   isMessagesLoading: false,

   getUsers :async ()=>{
      set({isUserLoading: true});
      try {
         const res = await axiosInstance.get("/messages/users");
         set({users: res.data});
      } catch (error) {
         toast.error(error.response.data.message);
      }
      finally {
         set({isUserLoading: false});
      }
   },

   getMessages :async (id)=>{
      set({isMessagesLoading: true});
      try {
         const res = await axiosInstance.get(`/messages/${id}`);
         const { privateKey, authUser } = useAuthStore.getState();
         const messages = await Promise.all(
            res.data.map(async (m) => ({ ...m, text: await decryptText(m, privateKey, m.senderId === authUser._id) }))
         );
         set({messages});
      } catch (error) {
         toast.error(error.response.data.message);
      }
      finally {
         set({isMessagesLoading: false});
      }
   },

   sendMessage : async (messageData)=>{
      const {selectedUser,messages}=get();
      try {
         let payload = messageData;
         if (messageData.text) {
            // make sure we have the receiver's public key (refresh once if it was missing)
            let receiver = selectedUser;
            if (!receiver.publicKey) {
               const { data } = await axiosInstance.get("/messages/users");
               receiver = data.find((u) => u._id === selectedUser._id) || receiver;
               set({ users: data, selectedUser: receiver });
            }
            if (!receiver.publicKey) {
               toast.error("This user has not set up encryption yet. They need to log in once.");
               return;
            }
            const myPublicKey = useAuthStore.getState().authUser.publicKey;
            payload = { ...messageData, ...(await encryptText(messageData.text, myPublicKey, receiver.publicKey)) };
         }
         const res=await axiosInstance.post(`/messages/send/${selectedUser._id}`,payload);
         // show the original (readable) text on our screen; the server only has the encrypted one
         set({messages:[...messages,{ ...res.data, text: messageData.text }]});
      } catch (error) {
         toast.error(error.response?.data?.message || "Failed to send message");
      }

   },

   subscribeToMessages:()=>{
      const {selectedUser}=get();
      if(!selectedUser) return;

      const socket=useAuthStore.getState().socket;

      socket.on("newMessage", async (newMessage)=>{
         const isMessageSentFromSelectedUser=newMessage.senderId===selectedUser._id;
         if (!isMessageSentFromSelectedUser) return;
         
         const text = await decryptText(newMessage, useAuthStore.getState().privateKey, false);
         set({messages:[...get().messages,{ ...newMessage, text }]});
      });
   },

   unsubscribeFromMessages:()=>{
      const socket=useAuthStore.getState().socket;
      socket.off("newMessage");
   },

   setSelectedUser: (selectedUser) => set({ selectedUser: selectedUser }),


}))

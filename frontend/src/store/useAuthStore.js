import { create } from 'zustand';
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import {io} from "socket.io-client";
import { generateKeyPair, lockPrivateKey, unlockPrivateKey } from "../lib/crypto.js";
// const BASE_URL = "http://localhost:5005";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const useAuthStore = create((set,get) => ({
   authUser: null,
   isSigningUp: false,
   isLoggingIn: false,
   isUpdatingProfile: false,
   isCheckingAuth: true,
   onlineUsers: [],
   socket:null,
   privateKey:null,

   // Called after signup/login: unlocks the private key (or creates the key pair the first time)
   setupKeys: async (user, password) => {
      let privateKey;
      if (user.publicKey && user.encryptedPrivateKey) {
         privateKey = await unlockPrivateKey(user.encryptedPrivateKey, password);
      } else {
         const keys = await generateKeyPair();
         const encryptedPrivateKey = await lockPrivateKey(keys.privateKey, password);
         const res = await axiosInstance.put("/auth/keys", { publicKey: keys.publicKey, encryptedPrivateKey });
         user = res.data;
         privateKey = keys.privateKey;
      }
      localStorage.setItem(`privateKey_${user._id}`, privateKey);
      set({ privateKey });
      return user;
   },

   checkAuth: async () => {
      try {
         const res = await axiosInstance.get("/auth/check");
         const privateKey = localStorage.getItem(`privateKey_${res.data._id}`);
         if (!privateKey) throw new Error("Private key not found on this device, please log in again");
         set({ authUser: res.data, privateKey });
         get().connectSocket();
      } catch (error) {
         console.log("Error in checkAuth:", error);
         set({ authUser: null });
      }
      finally {
         set({ isCheckingAuth: false });
      }
   },

   signup: async (data) => {
      set({ isSigningUp: true });
      try {
         const res = await axiosInstance.post("/auth/signup", data);
         const user = await get().setupKeys(res.data, data.password);
         set({ authUser: user });
         toast.success("Account Created Successfully");
         get().connectSocket();
      } catch (error) {
         toast.error(error.response?.data?.message || "Encryption setup failed");
      }
      finally {
         set({ isSigningUp: false });
      }
   },

   login: async (data) => {
      set({ isLoggingIn: true });
      try {
         const res = await axiosInstance.post("/auth/login", data);
         const user = await get().setupKeys(res.data, data.password);
         set({ authUser: user });
         toast.success("Login Successfully");
         get().connectSocket();
      } catch (error) {
         toast.error(error.response?.data?.message || "Encryption setup failed");
      }
      finally {
         set({ isLoggingIn: false });
      }
   },

   // Google sign-in / sign-up. Returns the user if we still need their encryption password, otherwise logs in.
   googleLogin: async (credential) => {
      try {
         const res = await axiosInstance.post("/auth/google", { credential });
         const user = res.data;
         const savedKey = localStorage.getItem(`privateKey_${user._id}`);
         if (!savedKey || !user.publicKey) return user; // first time / new device: ask for the password
         set({ authUser: user, privateKey: savedKey });
         toast.success("Login Successfully");
         get().connectSocket();
         return null;
      } catch (error) {
         toast.error(error.response?.data?.message || "Google sign-in failed");
         return null;
      }
   },

   // Second step of Google login: set/check the password, then unlock (or create) the encryption keys with it
   finishGoogleLogin: async (user, password, username) => {
      let current = user;
      if (!user.hasPassword) {
         await axiosInstance.put("/auth/set-password", { password, username }); // first time: saves username + account password
         current = { ...user, username: username.trim().toLowerCase(), hasPassword: true };
      } else {
         const res = await axiosInstance.post("/auth/login", { email: user.email, password }); // checks the password
         current = res.data;
      }
      const updatedUser = await get().setupKeys(current, password);
      set({ authUser: updatedUser });
      toast.success("Login Successfully");
      get().connectSocket();
   },

   logout: async () => {
      try {
         await axiosInstance.post("/auth/logout");
         set({ authUser: null, privateKey: null });
         toast.success("Logout Successfully");
         get().disconnectSocket();
      } catch (error) {
         toast.error(error.response.data.message);
      }
   },

   updateProfile: async (formData) => {

      set({ isUpdatingProfile: true });

      try {

         const res =
            await axiosInstance.put(
               "/auth/update-profile",
               formData,
               {
                  headers: {
                     "Content-Type":
                        "multipart/form-data"
                  }
               }
            );

         set({ authUser: res.data });

         toast.success("Profile Updated");

      } catch {

         toast.error("Upload failed");

      } finally {

         set({ isUpdatingProfile: false });

      }

   },

   connectSocket:()=>{
      const {authUser}=get()
      if(!authUser || get().socket?.connected) return;
      const socket=io(BASE_URL,{
         query:{
            userId:authUser._id,
         }
      });
      socket.connect();
      set({socket:socket});
      socket.on("getOnlineUsers" ,(userIds)=>{
         set({onlineUsers:userIds});
      });
   },
   disconnectSocket:()=>{
      if(get().socket?.connected) get().socket.disconnect();
   },


}));






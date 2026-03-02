import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
import fs from "fs";
import path from "path";

// ================= SIGNUP =================
export const signup = async (req, res) => {
   try {
      const { fullName, email, password } = req.body;

      // 1. Basic Validation
      if (!fullName || !email || !password) {
         return res.status(400).json({ message: "All fields are required" });
      }

      if (password.length < 6) {
         return res.status(400).json({
            message: "Password must be at least 6 characters long",
         });
      }

      // 2. Check Existing User
      const existingUser = await User.findOne({ email });
      if (existingUser) {
         return res.status(400).json({
            message: "User already exists with this email",
         });
      }

      // 3. Hash Password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // 4. Create User
      const newUser = new User({
         fullName,
         email,
         password: hashedPassword,
         profilePic: "",
      });

      // 5. Save User
      await newUser.save();

      // 6. Generate JWT Cookie
      generateToken(newUser._id, res);

      // 7. Response
      return res.status(201).json({
         _id: newUser._id,
         fullName: newUser.fullName,
         email: newUser.email,
         profilePic: newUser.profilePic,
      });

   } catch (error) {
      console.log("Error in signup controller:", error.message);
      return res.status(500).json({ message: "Internal Server Error" });
   }
};

export const login = async (req, res) => {
   const { email, password } = req.body;
   try {
      const user = await User.findOne({ email });
      if(!user){
         return res.status(404).json({message:"Invalid Credentials"});
      }
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if(!isPasswordCorrect){
         return res.status(404).json({message:"Invalid Credentials"});
      }
      generateToken(user._id, res);
      return res.status(200).json({
         _id: user._id,
         fullName: user.fullName,
         email: user.email,
         profilePic: user.profilePic,
      });
   } catch (error) {
      console.log("Error in login controller:", error.message);
      return res.status(500).json({ message: "Internal Server Error" });
   }
}
export const logout = async (req, res) => {
   try {
      res.cookie('jwt',{maxAge:0});
      return res.status(200).json({message:"Logout Successfully"});
   } catch (error) {
      console.log("Error in logout controller:", error.message);
      return res.status(500).json({ message: "Internal Server Error" });
   }
}


// export const updateProfile = async (req, res) => {
//    try {

//       const userId = req.user._id;

//       if (!req.file) {
//          return res.status(400).json({
//             message: "Image required"
//          });
//       }

//       console.log("Uploading to cloudinary...");

//       const uploadResponse =
//          await cloudinary.uploader.upload_stream(
//             {
//                folder: "chatapp_profiles"
//             },
//             async (error, result) => {

//                if (error) {
//                   console.log(error);
//                   return res.status(500).json({
//                      message: "Upload failed"
//                   });
//                }

//                const updatedUser =
//                   await User.findByIdAndUpdate(
//                      userId,
//                      { profilePic: result.secure_url },
//                      { new: true }
//                   );

//                res.json(updatedUser);
//             }
//          );

//       uploadResponse.end(req.file.buffer);

//    } catch (error) {

//       console.log("UPDATE PROFILE ERROR:", error);

//       res.status(500).json({
//          message: "Upload failed"
//       });

//    }
// };

export const updateProfile = async (req, res) => {
   try {

      const userId = req.user._id;

      if (!req.file) {
         return res.status(400).json({
            message: "Image required"
         });
      }

      console.log("Uploading to cloudinary...");

      const stream = cloudinary.uploader.upload_stream(
         {
            folder: "chatapp_profiles",

            // ⭐ Same ID every time → old image replaced
            public_id: `user_${userId}`,

            overwrite: true,

            resource_type: "image"
         },

         async (error, result) => {

            if (error) {
               console.log(error);

               return res.status(500).json({
                  message: "Upload failed"
               });
            }

            const updatedUser =
               await User.findByIdAndUpdate(
                  userId,
                  {
                     profilePic: result.secure_url
                  },
                  { new: true }
               );

            res.json(updatedUser);
         }
      );

      stream.end(req.file.buffer);

   } catch (error) {

      console.log("UPDATE PROFILE ERROR:", error);

      res.status(500).json({
         message: "Upload failed"
      });

   }
};

export const checkAuth = (req, res) => {
   try {
      return res.status(200).json(req.user);
   } catch (error) {
      console.log("error in checkAuth controller:", error.message);
      return res.status(500).json({ message: "Internal Server Error" });
   }
}
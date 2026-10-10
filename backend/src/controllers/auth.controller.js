import bcrypt from "bcryptjs";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import User from "../models/user.model.js";
import Otp from "../models/otp.model.js";
import { sendOtpEmail } from "../lib/mailer.js";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
import fs from "fs";
import path from "path";

// ================= SEND EMAIL OTP =================
// Step 1 of signup: emails a 6-digit code to prove the person owns the address.
export const sendOtp = async (req, res) => {
   try {
      const email = (req.body.email || "").trim().toLowerCase();
      if (!/^\S+@\S+\.\S+$/.test(email)) {
         return res.status(400).json({ message: "Enter a valid email address" });
      }
      if (await User.findOne({ email })) {
         return res.status(400).json({ message: "User already exists with this email" });
      }

      // Resend limit: one code per 60 seconds per email
      const existing = await Otp.findOne({ email });
      if (existing && Date.now() - existing.lastSentAt.getTime() < 60 * 1000) {
         return res.status(429).json({ message: "Please wait a minute before requesting another code" });
      }

      const otp = crypto.randomInt(100000, 1000000).toString();
      await Otp.findOneAndUpdate(
         { email },
         { otpHash: await bcrypt.hash(otp, 10), attempts: 0, expiresAt: new Date(Date.now() + 10 * 60 * 1000), lastSentAt: new Date() },
         { upsert: true }
      );

      try {
         await sendOtpEmail(email, otp);
      } catch (mailError) {
         // Address rejected or SMTP problem: don't keep a code nobody received
         await Otp.deleteOne({ email });
         console.log("OTP mail error:", mailError);
         const detail = process.env.NODE_ENV === "production" ? "" : ` (${mailError.message})`;
         return res.status(400).json({ message: "Could not send a code to this email. Check the address and try again." + detail });
      }

      return res.status(200).json({ message: "Verification code sent" });
   } catch (error) {
      console.log("Error in sendOtp controller:", error.message);
      return res.status(500).json({ message: "Internal Server Error" });
   }
};

// ================= SIGNUP =================
export const signup = async (req, res) => {
   try {
      const { fullName, password, otp } = req.body;
      const email = (req.body.email || "").trim().toLowerCase();

      // 1. Basic Validation
      if (!fullName || !email || !password || !otp) {
         return res.status(400).json({ message: "All fields are required" });
      }

      if (password.length < 6) {
         return res.status(400).json({
            message: "Password must be at least 6 characters long",
         });
      }

      // 1b. Verify the emailed OTP
      const record = await Otp.findOne({ email });
      if (!record || record.expiresAt < new Date()) {
         return res.status(400).json({ message: "Code expired. Please request a new one" });
      }
      if (record.attempts >= 5) {
         await Otp.deleteOne({ email });
         return res.status(400).json({ message: "Too many wrong attempts. Request a new code" });
      }
      if (!(await bcrypt.compare(String(otp), record.otpHash))) {
         await Otp.updateOne({ email }, { $inc: { attempts: 1 } });
         return res.status(400).json({ message: "Incorrect verification code" });
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

      await Otp.deleteOne({ email });

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
      if (!user) {
         return res.status(404).json({ message: "Invalid Credentials" });
      }
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
         return res.status(404).json({ message: "Invalid Credentials" });
      }
      generateToken(user._id, res);
      return res.status(200).json({
         _id: user._id,
         fullName: user.fullName,
         email: user.email,
         username: user.username,
         profilePic: user.profilePic,
         publicKey: user.publicKey,
         encryptedPrivateKey: user.encryptedPrivateKey,
      });
   } catch (error) {
      console.log("Error in login controller:", error.message);
      return res.status(500).json({ message: "Internal Server Error" });
   }
}
export const logout = async (req, res) => {
   try {
      res.cookie('jwt', { maxAge: 0 });
      return res.status(200).json({ message: "Logout Successfully" });
   } catch (error) {
      console.log("Error in logout controller:", error.message);
      return res.status(500).json({ message: "Internal Server Error" });
   }
}


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

// ================= GOOGLE LOGIN / SIGNUP =================
// The browser sends the Google ID token; we verify it with Google, then log the user in (creating the account if new).
export const googleAuth = async (req, res) => {
   try {
      const { credential } = req.body;
      if (!credential) {
         return res.status(400).json({ message: "Google credential is required" });
      }

      const clientId = process.env.GOOGLE_CLIENT_ID;
      const ticket = await new OAuth2Client(clientId).verifyIdToken({ idToken: credential, audience: clientId });
      const { email, name, picture, email_verified } = ticket.getPayload();

      if (!email || !email_verified) {
         return res.status(400).json({ message: "Google email is not verified" });
      }

      let user = await User.findOne({ email });
      if (!user) {
         // Google users have no password, so store a random one nobody knows
         const randomPassword = crypto.randomBytes(32).toString("hex");
         user = await User.create({
            fullName: name || email.split("@")[0],
            email,
            password: await bcrypt.hash(randomPassword, 10),
            profilePic: picture || "",
            hasPassword: false,
         });
      }

      generateToken(user._id, res);
      return res.status(200).json({
         _id: user._id,
         fullName: user.fullName,
         email: user.email,
         username: user.username,
         profilePic: user.profilePic,
         publicKey: user.publicKey,
         encryptedPrivateKey: user.encryptedPrivateKey,
         hasPassword: user.hasPassword,
      });
   } catch (error) {
      console.log("Error in googleAuth controller:", error.message);
      return res.status(401).json({ message: "Google sign-in failed" });
   }
};

// Lets a Google-created account set its first password (used for email login and to lock the encryption key)
export const setPassword = async (req, res) => {
   try {
      const { password } = req.body;
      const username = (req.body.username || "").trim().toLowerCase();

      if (req.user.hasPassword) {
         return res.status(400).json({ message: "Password already set" });
      }
      if (!/^[a-z0-9_]{3,20}$/.test(username)) {
         return res.status(400).json({ message: "Username must be 3-20 characters: letters, numbers or underscore" });
      }
      if (await User.findOne({ username, _id: { $ne: req.user._id } })) {
         return res.status(400).json({ message: "Username is already taken" });
      }
      if (!password || password.length < 6) {
         return res.status(400).json({ message: "Password must be at least 6 characters long" });
      }

      const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
      await User.findByIdAndUpdate(req.user._id, { password: hashedPassword, hasPassword: true, username });

      return res.status(200).json({ message: "Password set" });
   } catch (error) {
      console.log("Error in setPassword controller:", error.message);
      return res.status(500).json({ message: "Internal Server Error" });
   }
};

// Saves the user's public key + password-locked private key (only allowed once)
export const saveKeys = async (req, res) => {
   try {
      const { publicKey, encryptedPrivateKey } = req.body;

      if (!publicKey || !encryptedPrivateKey) {
         return res.status(400).json({ message: "Keys are required" });
      }
      if (req.user.publicKey) {
         return res.status(400).json({ message: "Encryption keys already exist" });
      }

      const updatedUser = await User.findByIdAndUpdate(
         req.user._id,
         { publicKey, encryptedPrivateKey },
         { new: true }
      ).select("-password");

      return res.status(200).json(updatedUser);
   } catch (error) {
      console.log("Error in saveKeys controller:", error.message);
      return res.status(500).json({ message: "Internal Server Error" });
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
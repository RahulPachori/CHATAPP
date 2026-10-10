//route file for authentication
import express from "express";
import { upload } from "../middleware/upload.middleware.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { login, logout, signup, sendOtp, updateProfile, checkAuth, saveKeys, googleAuth, setPassword } from "../controllers/auth.controller.js";
const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/google', googleAuth);

router.put(
   "/update-profile",
   protectRoute,
   upload.single("profilePic"),
   updateProfile
);

router.put('/keys', protectRoute, saveKeys);
router.put('/set-password', protectRoute, setPassword);
router.get('/check',protectRoute, checkAuth);

export default router;

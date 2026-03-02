//route file for authentication
import express from "express";
import { upload } from "../middleware/upload.middleware.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { login, logout, signup, updateProfile, checkAuth } from "../controllers/auth.controller.js";
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
// router.put("/update-profile",protectRoute, updateProfile);
router.put(
   "/update-profile",
   protectRoute,
   upload.single("profilePic"),
   updateProfile
);

router.get('/check',protectRoute, checkAuth);

export default router;

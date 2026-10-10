import mongoose from "mongoose";

// One pending email-verification code per email. MongoDB deletes it automatically once expiresAt passes (TTL index).
const otpSchema = new mongoose.Schema({
   email: { type: String, required: true, unique: true, lowercase: true, trim: true },
   otpHash: { type: String, required: true },
   attempts: { type: Number, default: 0 },
   expiresAt: { type: Date, required: true, index: { expires: 0 } },
   lastSentAt: { type: Date, default: Date.now }
});

export default mongoose.model("Otp", otpSchema);

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
   email:{
      type: String,
      required: true,
      unique: true
   },
   // Unique handle chosen by the user the first time they sign in with Google
   username:{
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true
   },
   fullName:{
      type: String,
      required: true
   },
   password:{
      type: String,
      required: true,
      minlength: 6
   },
   profilePic:{
      type: String,
      default:""
   },
   // End-to-end encryption: public key is shared, private key is stored only in a password-locked form
   // false for accounts created with Google until the user sets a password
   hasPassword:{
      type: Boolean,
      default: true
   },
   publicKey:{
      type: String,
      default:""
   },
   encryptedPrivateKey:{
      type: String,
      default:""
   }

},{timestamps: true}
);

const User = mongoose.model("User", userSchema);
export default User;
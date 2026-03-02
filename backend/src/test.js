import dotenv from "dotenv";

dotenv.config();

import cloudinary from "./lib/cloudinary.js";

const test = async () => {

   try {

      const res = await cloudinary.uploader.upload(
         "https://dummyimage.com/300"
      );

      console.log("SUCCESS:");
      console.log(res.secure_url);

   } catch (err) {

      console.log("FAILED:");
      console.log(err);

   }

};

test();
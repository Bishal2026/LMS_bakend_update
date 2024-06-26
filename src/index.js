import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/index.db.js";
import { v2 } from "cloudinary";

import Razorpay from "razorpay";

dotenv.config({
  path: "./src/.env",
});

v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

//db connect
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 9000, () => {
      console.log(`server is running port :${process.env.PORT} `);
    });
  })
  .catch((e) => {
    console.log(e);
  });

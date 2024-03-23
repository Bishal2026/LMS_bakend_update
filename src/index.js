import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/index.db.js";

dotenv.config({
  path: "./src/.env",
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

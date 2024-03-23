import mongoose from "mongoose";
import { DB_NAME } from "../contanst.js";

mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    const intancesdb = await mongoose.connect(
      `${process.env.MONGO_URI || "mongodb://localhost:27017"}/${DB_NAME}`
    );
    if (intancesdb) {
      console.log(`DB connect !! ${intancesdb.connection.host}`);
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;

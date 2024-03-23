import mongoose from "mongoose";
import { DB_NAME } from "../contanst.js";

const connectDB = async () => {
  try {
    const intancesdb = await mongoose.connect(`${process.env.MONGODB_URL} /
        ${DB_NAME}`);
    console.log(`DB connect !! ${intancesdb.connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;

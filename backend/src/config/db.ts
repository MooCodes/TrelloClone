import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    let URI =
      process.env.NODE_ENV === "test"
        ? process.env.MONGO_URI_TEST!
        : process.env.MONGO_URI!;
    const conn = await mongoose.connect(URI);
    if (process.env.NODE_ENV !== "test") {
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    }
    process.exit(1);
  }
};

export default connectDB;

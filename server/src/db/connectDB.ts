import mongoose from "mongoose";
import ENV_VARIABLES from "../constants";

async function connectDB() {
  try {
    const uri: string = ENV_VARIABLES.mongoUri;
    const { connection } = await mongoose.connect(uri);
    console.info(`⚙️ MongoDB connected, DB HOST: ${connection.host}`);
  } catch (error) {
    console.error("⚠️ Error connecting to the database:", error);
    process.exit(1);
  }
}

export default connectDB;

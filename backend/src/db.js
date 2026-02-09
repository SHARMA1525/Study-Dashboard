

import mongoose from "mongoose"

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log("MongoDB connected")
  } catch (error) {
    console.error("Database Connection Failed")
    throw error
  }
}

export default connectDb

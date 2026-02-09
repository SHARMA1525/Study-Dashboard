// import dotenv from "dotenv"
// import app from "./src/app.js"
// import connectDb from "./src/db.js"

// dotenv.config()

// const PORT = process.env.PORT || 5001


// await connectDb()

// app.listen(PORT, () => {
//   console.log(`🚀 Backend running on port ${PORT}`)
// })

import dotenv from "dotenv"
dotenv.config()
import app from "./src/app.js"
import connectDb from "./src/db.js"

const PORT = process.env.PORT || 5000

const startServer = async () => {
  try {
    await connectDb(process.env.MONGO_URL)
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Backend running on 0.0.0.0:${PORT}`)
    })
  } catch (error) {
    console.error("Failed to start server", error)
    process.exit(1)
  }
}

startServer()

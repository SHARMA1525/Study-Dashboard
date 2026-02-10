import express from 'express'
import cors from 'cors'
import authRoutes from "./auth.js"
import subjectRoutes from "./subjects.js"
import taskRoutes from "./tasks.js"
import noteRoutes from "./notes.js"
const app = express()

// 🔥 GLOBAL LOGGER (MUST BE FIRST)
app.use((req, res, next) => {
    console.log(`➡️  [BACKEND] ${req.method} ${req.url}`)
    next()
})

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))
app.use(express.json())

app.use("/api/subjects", subjectRoutes)
app.use("/api/tasks", taskRoutes)
app.use("/api/notes", noteRoutes)
app.use("/api/auth", authRoutes)

app.get("/api/health", (req, res) => {
    res.send("Backend is alive")
})

export default app

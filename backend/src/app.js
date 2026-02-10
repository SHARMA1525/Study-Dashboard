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

const allowedOrigins = [
    "http://localhost:3000",
    "https://www.studydashboard.com",
    "https://studydashboard.com"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.includes(".vercel.app")) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
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

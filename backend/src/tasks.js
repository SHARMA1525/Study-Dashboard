import express from "express"
import { Task } from "./model.js"
import authMiddleware from "./authMiddleware.js"

const router = express.Router()

router.get("/", authMiddleware, async (req, res) => {
    try {
        const filter = { userId: req.userId }
        if (req.query.subjectId) {
            filter.subjectId = req.query.subjectId
        }
        const tasks = await Task.find(filter)
        res.json(tasks)
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch tasks" })
    }
})

router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, subjectId, dueDate, priority } = req.body
        if (!title || !subjectId) {
            return res.status(400).json({ message: "Title and subject are required" })
        }
        const task = await Task.create({
            userId: req.userId,
            subjectId,
            title,
            dueDate,
            priority
        })
        return res.status(201).json(task)
    } catch (error) {
        console.error("CREATE TASK ERROR:", error)
        return res.status(500).json({ message: "Failed to create task" })
    }
})

router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            req.body,
            { new: true }
        );
        if (!task) {
            return res.status(404).json({ message: "Task not found" })
        }
        res.json(task)
    }
    catch (error) {
        return res.status(500).json({ message: "Failed to update task" })
    }
})

router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete(
            { _id: req.params.id, userId: req.userId }
        )
        if (!task) {
            return res.status(404).json({ message: "Task not found" })
        }
        return res.json({ message: "Task deleted" })
    } catch (error) {
        return res.status(500).json({ message: "Failed to delete task" })
    }
})

export default router
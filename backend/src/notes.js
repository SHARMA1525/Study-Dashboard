import express from "express"
import authMiddleware from "./authMiddleware.js"
import { Note } from "./model.js"
import mongoose from "mongoose"

const router = express.Router()

router.get("/", authMiddleware, async (req, res) => {
    try {
        const { subjectId } = req.query
        const filter = { userId: req.userId }
        if (subjectId) {
            if (!mongoose.Types.ObjectId.isValid(subjectId)) {
                return res.status(400).json({message:"Invalid subjectId"})
            }
            filter.subjectId = subjectId
        }
        const note = await Note.find(filter).sort({ createdAt: -1 })
        res.json(note)
    } catch (error) {
        res.status(500).json({message:"Failed to fetch Notes"})
    }
})

router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, content, subjectId } = req.body
        if (!title || !content || !subjectId) {
            return res.status(400).json({message:"All fields are required"})
        }
        if (!mongoose.Types.ObjectId.isValid(subjectId)) {
            return res.status(400).json({message:"Invalid subjectId"})
        }
        const note = await Note.create({
            userId: req.userId,
            subjectId,
            title,
            content
        })
        res.status(201).json(note)
    } catch (error) {
        return res.status(500).json({message:"Failed to create notes"})
    }
})

router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const note = await Note.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            req.body,
            {new:true}
        )
        if (!note) {
            return res.status(404).json({message:"No note found"})
        }
        res.json(note)
    } catch (error) {
        return res.status(500).json({message:"Failed to create notes"})
    }
})

router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const note = await Note.findOneAndDelete(
            { _id: req.params.id, userId: req.userId },
        )
        if (!note) {
            return res.status(404).json({message:"No note found"})
        }
        res.json({message:"Note deleted"})
    } catch (error) {
        return res.status(500).json({message:"Failed to delete note"})
    }
})

export default router
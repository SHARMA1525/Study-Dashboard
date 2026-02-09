import express from "express"

import { Subject } from "./model.js"

import authMiddleware from "./authMiddleware.js"

const router = express.Router()

router.get("/", authMiddleware, async (req, res) => {
    const subjects = await Subject.find({ userId: req.userId })
    res.json(subjects)
})

router.post("/", authMiddleware, async (req, res) => {
    const subject = await Subject.create({
        userId:req.userId,
        name: req.body.name,
        color:req.body.color
    })
    res.json(subject)
})

router.delete("/:id", authMiddleware, async (req, res) => {
    await Subject.findOneAndDelete({
        _id: req.params.id,
        userId:req.userId
    })
    res.json({message:"Subject deleted"})
})

export default router
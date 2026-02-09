import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from './model.js'


const router = express.Router()

router.post("/signup", async (req, res) => {
    try {
        console.log("SIGNUP ROUTE HIT")
        console.log("BODY:", req.body)
        const { name, email, password } = req.body
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "User Already Exists" })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })
        return res.status(201).json({ message: "User Created successfully" })
    } catch (error) {
        return res.status(500).json({ message: "Signup failed" })
    }

})

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" })
        }
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )
        res.json({ token })
    } catch (error) {
        console.log("LOGIN ERROR:", error)
        return res.status(500).json({ message: "Login Failed" })
    }
})

export default router
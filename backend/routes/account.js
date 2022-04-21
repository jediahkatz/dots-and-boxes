import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import auth from '../middlewares/auth.js'

const router = express.Router()

router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body
        if (!username || !password) {
            return res.status(400).send({ error: 'Not all fields have been entered' })
        }
        if (await User.findOne({ username })) {
            res.status(400).send({ error: 'User with that name already exists' })
        } else {
            const passwordHash = await bcrypt.hash(password, 10)
            await User.create({ username, password: passwordHash })
            res.send({ msg: 'Successfully created user' })
        }
    } catch (e) {
        console.log(e)
        res.status(500).send({ error: e.message })
    }
})

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body
        if (!username || !password) {
            return res.status(400).send({ error: 'Not all fields have been entered' })
        }
        const user = await User.findOne({ username })
        if (!user) {
            return res
            .status(400)
            .send({ error: 'Invalid credentials' })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).send({ error: 'Invalid credentials' })
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: 86400 })
        res.send({
            token,
            userId: user._id
        })
    } catch (e) {
        console.log(e)
        res.status(500).send({ error: e.message })
    }
})

router.get('/isAuthenticated', (req, res) => {
    try {
        const token = req.header('x-auth-token')
        if (!token) {
            return res.status(200).json({ isAuthenticated: false })
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        if (!verified) {
            return res.status(200).json({ isAuthenticated: false })
        }
        return res.status(200).json({ isAuthenticated: true })
    } catch (e) {
        res.status(200).json({ isAuthenticated: false })
    }
})

export default router
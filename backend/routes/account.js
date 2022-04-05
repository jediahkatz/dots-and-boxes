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
            return res.status(400).send({ msg: 'Not all fields have been entered' })
        }
        if (await User.findOne({ username })) {
            res.status(400).send({ error: 'User with that name already exists' })
        } else {
            const passwordHash = await bcrypt.hash(password, 10)
            console.log(username, passwordHash)
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
            return res.status(400).send({ msg: 'Not all fields have been entered' })
        }
        const user = await User.findOne({ username })
        if (!user) {
            return res
            .status(400)
            .send({ msg: 'Invalid credentials' })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).send({ msg: 'Invalid credentials' })
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: 86400 })
        res.send({
            token: `Bearer ${token}`,
            userId: user._id
        })
    } catch (e) {
        console.log(e)
        res.status(500).send({ error: e.message })
    }
})

router.post('/logout', auth, (req, res) => {
    try {
        localStorage.removeItem('token')
        sessionStorage.removeItem('token')
        res.send({ msg: 'Successfully logged out' })
    } catch (e) {
        console.log(e)
        res.status(500).send({ error: e.message })
    }
})

export default router
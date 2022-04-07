import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

const auth = (req, res, next) => {
    try {
        const token = req.header('x-auth-token')
        if (!token) {
            return res.status(401).json({ msg: 'No authentication token, access denied' })
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        if (!verified) {
            return res.status(401).json({ msg: 'Token verification failed, authorization denied' })
        }
        req.userId = mongoose.Types.ObjectId(verified.id)
        next()
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: e.message })
    }
}

export default auth
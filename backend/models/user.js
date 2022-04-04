import mongoose from 'mongoose'

const { Schema, model } = mongoose

const userSchema = new Schema(
    {
        username: { type: String, required: true },
        password: { type: String, required: true },
        wins: { type: Number, required: true, default: 0 },
        losses: { type: Number, required: true, default: 0 },
        draws: { type: Number, required: true, default: 0 },
    }, 
    { timestamps: true }
)

const User = model('User', userSchema)

export default User
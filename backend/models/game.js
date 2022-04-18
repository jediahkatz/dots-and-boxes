import mongoose from 'mongoose'

const { Schema, model } = mongoose

const gameSchema = new Schema(
    {
        rows: { type: Number, required: true, min: 2, max: 6 },
        cols: { type: Number, required: true, min: 2, max: 6 },
        player1: { type: Schema.Types.ObjectId, ref: 'User' },
        player2: { type: Schema.Types.ObjectId, ref: 'User' },
        player1BoxCount: { type: Number, required: true, default: 0 },
        player2BoxCount: { type: Number, required: true, default: 0 },
        completed: { type: Boolean, required: true, default: false },
    },
    { timestamps: true }
)

const Game = model('Game', gameSchema)

export default Game
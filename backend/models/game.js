import mongoose from 'mongoose'

const { Schema, model } = mongoose

const gameSchema = new Schema(
    {
        player1: { type: Schema.Types.ObjectId, ref: 'User' },
        player2: { type: Schema.Types.ObjectId, ref: 'User' },
        player1_boxes: { type: Number, required: true, default: 0 },
        player2_boxes: { type: Number, required: true, default: 0 },
        completed: { type: Boolean, required: true, default: false },
    },
    { timestamps: true }
)

const Game = model('Game', gameSchema)

export default Game
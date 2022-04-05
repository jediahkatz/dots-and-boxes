import express from 'express'
import Game from '../models/game.js'
import auth from '../middlewares/auth.js'

const router = express.Router()

router.post('/create', auth, async (req, res) => {
    try {
        const { rows, cols } = req.body
        if (!rows || !cols) {
            return res.status(400).send({ msg: 'Not all fields have been entered' })
        }
        const userId = req.userId
        const game = await Game.create({
            rows,
            cols,
            player1: userId,
        })
        res.send({ 
            msg: `Successfully created a new ${rows} x ${cols} game`,
            gameId: game._id
        })
    } catch (e) {
        console.log(e)
        res.status(500).send({ error: e.message })
    }
})

router.post('/join/:id', auth, async (req, res) => {
    try {
        const { id: gameId } = req.params
        if (!gameId) {
            return res.status(400).send({ msg: 'Missing game id' })
        }
        // Race condition: 
        //   - A calls /join, sees game is empty
        //   - B calls /join, sees game is empty
        //   - A writes player2 = A, success
        //   - B overwrites player2 = B, success
        // We can use findOneAndUpdate to ensure atomic writes
        const userId = req.userId
        const game = await Game.findOneAndUpdate(
            { 
                _id: gameId, 
                // will only succeed if a player2 has not joined already
                player2: { $exists: false }
            },
            { player2: userId }
        )
        if (!game) {
            return res.status(400).send({ msg: 'Invalid or already full game id' })
        }
        res.send({ 
            msg: `Successfully joined game`,
            gameId
        })
    } catch (e) {
        console.log(e)
        res.status(500).send({ error: e.message })
    }
})

export default router
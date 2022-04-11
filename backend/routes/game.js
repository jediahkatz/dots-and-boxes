import express from 'express'
import Game from '../models/game.js'
import auth from '../middlewares/auth.js'
import User from '../models/user.js'

const router = express.Router()

router.post('/create', auth, async (req, res) => {
    try {
        const { rows, cols } = req.body
        if (!rows || !cols) {
            return res.status(400).send({ error: 'Not all fields have been entered' })
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
            return res.status(400).send({ error: 'Missing game id' })
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
            return res.status(400).send({ error: 'Invalid or already full game id' })
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

/**
 * Get the info about an ongoing game that this user is a part of.
 */
router.get('/info/:id', auth, async (req, res) => {
    try {
        const { id: gameId } = req.params
        if (!gameId) {
            return res.status(400).send({ error: 'Missing game id' })
        }

        const game = await Game.findById(gameId)
        if (!game) {
            return res.status(400).send({ error: 'Invalid game id' })
        }

        const userId = req.userId
        const { rows, cols, player1, player2, completed } = game
        if (!userId.equals(player1) && !userId.equals(player2)) {
            return res.status(401).send({ error: 'User is not in the game' })
        }

        if (completed) {
            return res.status(400).send({ error: 'Game already completed' })
        }

        const { username: player1Name } = await User.findById(player1)
        if (!player2) {
            res.send({
                rows,
                cols,
                isPlayer1: true,
                player1Name
            })
        } else {
            const { username: player2Name } = await User.findById(player2)
            res.send({
                rows,
                cols,
                isPlayer1: userId === player1,
                player1Name,
                player2Name
            })
        }
    } catch (e) {
        console.log(e)
        res.status(500).send({ error: e.message })
    }
})

export default router
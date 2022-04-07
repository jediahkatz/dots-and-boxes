import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import http from 'http'
import { Server } from 'socket.io'
import accountRouter from './routes/account.js'
import gameRouter from './routes/game.js'

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test'
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const port = process.env.PORT || 3000
const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.json())
app.use(cors())

app.use('/account', accountRouter)
app.use('/game', gameRouter)

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err)
    }
    res.status(500).send('Error!')
})

app.get('/favicon.ico', (req, res) => {
    res.status(404).send()
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
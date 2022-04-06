import express from 'express'
import mongoose from 'mongoose'
import http from 'http'
import { Server } from 'socket.io'
import accountRouter from './routes/account.js'

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
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.use('/account', accountRouter)

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
import express from 'express'

const app = express()

const port = process.env.PORT || 3000

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err)
    }
    res.status(500).send('Error!')
})

app.get('/favicon.ico', (req, res) => {
    res.status(404).send()
})
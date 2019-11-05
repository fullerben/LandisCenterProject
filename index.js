const express = require('express')
      bodyParser = require('bodyParser')
      PORT = process.env.PORT || 8080

const index = require('./routes/index')
      test = require('./routes/test')

const app = express()

app.use('/', index)
app.use('/test', test)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(PORT, () => {
    console.log(`Running on ${PORT}...`)
})
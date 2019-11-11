const express = require('express')
      bodyParser = require('body-parser')
      sassMiddleware = require('node-sass-middleware')
      path = require('path')
      PORT = process.env.PORT || 8080

const index = require('./routes/index')
      test = require('./routes/test')

const app = express()

app.use('/', index)
app.use('/test', test)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(sassMiddleware({
    src: path.join(__dirname, 'scss'),
    dest: path.join(__dirname, 'client'),
    outputStyle: 'compressed',
    prefix: '/css'
}))
app.use('/client', express.static(path.join(__dirname, 'client')))

app.set('view engine', 'ejs')

app.listen(PORT, () => {
    console.log(`Running on ${PORT}...`)
})
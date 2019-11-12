const express = require('express')
      bodyParser = require('body-parser')
      sassMiddleware = require('node-sass-middleware')
      path = require('path')
      ejs = require('ejs')
      dotenv = require('dotenv')

dotenv.config()
const PORT = process.env.PORT || 8080

const index = require('./routes/index')
      test = require('./routes/test')

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.engine('html', ejs.renderFile)
app.use(express.static(path.join(__dirname, '/client')))


app.use('/', index)
app.use('/test', test)

// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))
// app.use(sassMiddleware({
//     src: path.join(__dirname, 'scss'),
//     dest: path.join(__dirname, 'client'),
//     outputStyle: 'compressed',
//     prefix: '/css'
// }))

app.listen(PORT, () => {
    console.log(`Running on ${PORT}...`)
})
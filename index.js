const express = require('express')
      bodyParser = require('body-parser')
      sassMiddleware = require('node-sass-middleware')
      path = require('path')
      ejs = require('ejs')
      dotenv = require('dotenv')
      passport = require('passport')
      LocalStrategy = require('passport-local').Strategy

dotenv.config()
const PORT = process.env.PORT || 8080

const index = require('./routes/index')
      contacts = require('./routes/contacts')
      test = require('./routes/test')
      api = require('./routes/api')
      organizations = require('./routes/organizations')
      actions = require('./routes/actions')

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.engine('html', ejs.renderFile)
app.use(express.static(path.join(__dirname, '/client')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


app.use('/', index)
app.use('/contacts', contacts)
app.use('/test', test)
app.use('/api', api)
app.use('/organizations', organizations)
app.use('/actions', actions)

// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))
// app.use(sassMiddleware({
//     src: path.join(__dirname, 'scss'),
//     dest: path.join(__dirname, 'client'),
//     outputStyle: 'compressed',
//     prefix: '/css'
// }))

passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err) }
        if (!user) { return done(null, false) }
        if (!user.verifyPassword(password)) { return done(null, false) }
        return done(null, user);
      });
    }
))

app.listen(PORT, () => {
    console.log(`Running on ${PORT}...`)
})
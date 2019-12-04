const express = require('express')
      bodyParser = require('body-parser')
      cookieParser = require('cookie-parser')
      path = require('path')
      ejs = require('ejs')
      dotenv = require('dotenv')
      passport = require('passport')
      LocalStrategy = require('passport-local').Strategy
      session = require('express-session')
      bcrypt = require('bcryptjs')

// Passport security middleware configuration
passport.serializeUser((user, done) => {
    console.log(user.username)
    done(null, user.username)
})
passport.deserializeUser(async (username, done) => {
    const user = await db.getUser(username)
    return done(null, user)
})
passport.use('local', new LocalStrategy({}, async (username, password, done) => {
    const user = await db.getUser(username)
    if(user === null) return done(null, false)
    else if(!bcrypt.compareSync(password, user.rows[0].password)) return done(null, false)
    else if(!user.rows[0].admin) return done(null, false)
    else return done(null, user.rows[0])
}))

// Load environment variables
dotenv.config()
const PORT = process.env.PORT || 8080

// Set up express
const app = express()

// Load additional middleware
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.engine('html', ejs.renderFile)
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Use express sessions to preserve login state
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true
}))

// Initialize passport
app.use(passport.initialize())
app.use(passport.session())

app.use(express.static(path.join(__dirname, '/client')))

// Configure routes
const index = require('./routes/index')
      contacts = require('./routes/contacts')
      api = require('./routes/api')
      organizations = require('./routes/organizations')
      actions = require('./routes/actions')
app.use('/', index)
app.use('/contacts', contacts)
app.use('/api', api)
app.use('/organizations', organizations)
app.use('/actions', actions)

// Start server
app.listen(PORT, () => {
    console.log(`Running on ${PORT}...`)
})
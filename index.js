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
    done(null, user.id)
})
passport.deserializeUser(async (id, done) => {
    const user = await db.getUserById(id)
    return done(null, user)
})
passport.use('local', new LocalStrategy({}, async (username, password, done) => {
    const user = await db.getUser(username)
    if(user === null) return done(null, false)
    else if(!bcrypt.compareSync(password, user.rows[0].password)) return done(null, false)
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
app.use(express.static(path.join(__dirname, '/client')))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Configure routes
const index = require('./routes/index')
      contacts = require('./routes/contacts')
      test = require('./routes/test')
      api = require('./routes/api')
      organizations = require('./routes/organizations')
      actions = require('./routes/actions')
app.use('/', index)
app.use('/contacts', contacts)
app.use('/test', test)
app.use('/api', api)
app.use('/organizations', organizations)
app.use('/actions', actions)

// Use express sessions to preserve login state
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true
}))

// Initialize passport
app.use(passport.initialize())
app.use(passport.session())

// Start server
app.listen(PORT, () => {
    console.log(`Running on ${PORT}...`)
})
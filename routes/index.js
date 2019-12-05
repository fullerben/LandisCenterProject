const express = require('express')
      router = express.Router()
      passport = require('passport')
      db  = require('../db.js')
      bcrypt = require('bcryptjs')

router.get('/', async (req, res) => {
    const actions = await db.getMostRecentActions()
    const events = await db.getUpcomingVolunteerEventsWithContact()
    res.render('home', {actions: actions.rows, events: events.rows })
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', async (req, res) => {
    console.log(req.logIn)
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', async (req, res) => {
    const hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync())
    await db.addUser({
        username: req.body.username,
        password: hash,
        name: req.body.name === '' ? null : req.body.name,
        email: req.body.email === '' ? null : req.body.email
    })
    res.redirect('/')
})

module.exports = router
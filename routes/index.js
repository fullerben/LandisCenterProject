const express = require('express')
      router = express.Router()
      db  = require('../db.js')

router.get('/', async (req, res) => {
    const actions = await db.getMostRecentActions()
    const events = await db.getUpcomingVolunteerEventsWithContact()
    res.render('home', {actions: actions.rows, events: events.rows })
})

router.get('/login', (req, res) => {
    res.render('login')
})

module.exports = router
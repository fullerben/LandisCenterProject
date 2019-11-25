const express = require('express')
      router = express.Router()
      db  = require('../db.js')

router.get('/', async (req, res) => {
    const actions = await db.getMostRecentActions();
    res.render('home', {actions: actions.rows})
})

module.exports = router
const express = require('express')
      router = express.Router()
      db  = require('../db.js')

router.get('/add', (req, res) => {
    const action = req.body
})

module.exports = router
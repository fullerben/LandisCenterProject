const express = require('express')
      import executeQuery from '../db.js'
      router = express.Router()

router.get('*', (req, res) => {
    executeQuery('select * from partners', (res) => {
        console.log(res)
    })
    res.render('index')
})

module.exports = router
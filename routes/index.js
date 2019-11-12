const express = require('express')
      router = express.Router()
      db  = require('../db.js')

router.get('*', async (req, res) => {
    const contacts = await db.executeQuery('select * from Contacts limit 10')
    console.log(contacts.rows)

    res.render('index', { contacts: contacts.rows })
})

module.exports = router
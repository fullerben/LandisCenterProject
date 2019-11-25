const express = require('express')
      router = express.Router()
      db  = require('../db.js')

router.get('/all', async (req, res) => {
    const contacts = await db.getContactsWithOrganizations()
    res.render('index', { contacts: contacts.rows })
})

module.exports = router
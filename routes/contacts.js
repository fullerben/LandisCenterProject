const express = require('express')
      router = express.Router()
      db  = require('../db.js')

router.get('/all', async (req, res) => {
    const contacts = await db.getContactsWithOrganizations()
    res.render('index', { contacts: contacts.rows })
})

router.get('/add', (req, res) => {
    res.render('addcontact')
})

router.post('/add', (req, res) => {
    console.log(req.body)
    res.redirect('/contacts/all')
})

module.exports = router
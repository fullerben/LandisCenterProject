const express = require('express')
      router = express.Router()
      db = require('../db.js')

router.get('/contacts', async (req, res) => {
    const contacts = await db.executeQuery('select * from contacts')
    res.json(contacts.rows)
})

router.get('/contacts/all', async (req, res) => {
    const contacts = await db.getContactsWithOrganizations()
    res.json(contacts.rows)
})

module.exports = router


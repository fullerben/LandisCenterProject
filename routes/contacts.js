const express = require('express')
      router = express.Router()
      db  = require('../db.js')


const scrubContact = (contact) => {
    return {
        name: contact.name,
        email: contact.email,
        phone: contact.phone.replace(/-/g, ''),
        secondary_phone: contact.secondary_phone === '' ? null : contact.secondary_phone,
        extension: contact.extension === '' ? null : contact.extension
    }
}

router.get('/all', async (req, res) => {
    const contacts = await db.getContactsWithOrganizations()
    res.render('index', { contacts: contacts.rows })
})

router.get('/add', (req, res) => {
    res.render('addcontact')
})

router.post('/add', (req, res) => {
    const contact = scrubContact(req.body) // Will need to be scrubbed more for security eventually
    db.insertContact(contact)
    res.redirect('/contacts/all')
})

module.exports = router
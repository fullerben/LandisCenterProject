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
    res.redirect('/contacts/add')
})

router.get('/search', async (req, res) => {
    const contacts = await db.getContacts()
    res.render('search', { contacts: contacts.rows })
})

router.post('/search/org', (req, res) => {
    const contact = req.body.org
    db.getContactUsingOrganization(contact)
    res.render('search', { contacts: contacts.rows })
})

router.get('/update', (req, res) => {
    res.render('addcontact')
})

router.post('/update', (req, res) => {
    const contact = scrubContact(req.body) // how do I change this to individuals 
    db.updateContactPhone(contact)
    db.updateContactSecondaryPhone(contact)
    db.updateExtension(contact)
    res.redirect('/contacts/search')
})

module.exports = router
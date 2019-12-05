const express = require('express')
      router = express.Router()
      db  = require('../db.js')
      auth = require('../auth')


const scrubContact = (contact) => {
    return {
        name: contact.name,
        email: contact.email,
        phone: contact.phone.replace(/-/g, ''),
        secondary_phone: contact.secondary_phone === '' ? null : contact.secondary_phone,
        extension: contact.extension === '' ? null : contact.extension
    }
}

router.get('/all', auth.authenticateUser, async (req, res) => {
    const contacts = await db.getContactsWithOrganizations()
    res.render('searchContacts', { contacts: contacts.rows })
})

router.get('/faculty', async (req, res) => {
    const contacts = await db.getFacultyContacts()
    res.render('searchFaculty', { contacts: contacts.rows })
})

router.get('/add', auth.authenticateUser, (req, res) => {
    res.render('addcontact')
})

router.post('/add', auth.authenticateUser, (req, res) => {
    const contact = scrubContact(req.body) // Will need to be scrubbed more for security eventually
    db.insertContact(contact)
    res.redirect('/contacts/add')
})

router.get('/search', auth.authenticateUser, async (req, res) => {
    const contacts = await db.getContacts()
    res.render('search', { contacts: contacts.rows })
})

router.post('/search/name', async (req, res) => {
    const contact = req.body.name
    let contacts;
    if (contact == "") {
        contacts = db.getContacts();
    }
    contacts = await db.getContactUsingLikeName(contact)
    res.render('searchContacts', { contacts: contacts.rows })
})

router.post('/search/faculty', async (req, res) => {
    const contact = req.body.department
    let contacts;
    if (contact == "") {
        contacts = db.getFacultyContacts();
    }
    contacts = await db.getFacultyContactUsingDepartment(contact)
    res.render('searchFaculty', { contacts: contacts.rows })
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
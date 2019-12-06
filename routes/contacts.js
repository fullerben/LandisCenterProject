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
    let contacts;
    if(!req.query.length) {
        contacts = await db.getContactsWithOrganizations()
    } else {
        contacts = await db.getContactsUsingLIKEName(req.query.search)
    }
    res.render('contactsName', { contacts: contacts.rows })
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

router.get('/search/org', async (req, res) => {
    const contact = req.body.name
    let contacts;
    if (contact == "") {
        contacts = db.getContacts();
    }
    contacts = await db.getContactsUsingLIKEOrganization(contact)
    res.render('search', { contacts: contacts.rows })
})

router.get('/search/name', async (req, res) => {
    const contact = req.query.name
    let contacts
    if (contact === "") {
        contacts = await db.getContacts()
    }
    contacts = await db.getContactsUsingLIKEName(contact)
    res.render('search', { contacts: contacts.rows })
})

router.get('/view/:id', async (req, res) => {
    const contact = await db.getContactById(req.params.id)
    res.render('viewcontact', {contact: contact.rows[0]})
})

router.get('/update/:id', auth.authenticateUser, async (req, res) => {
    const contact = await db.getContactById(req.params.id)
    res.render('updatecontact', {contact: contact.rows[0]})
})

router.post('/update', auth.authenticateUser, async (req, res) => {
    const contact = scrubContact(req.body)
    if(!contact.email) res.redirect('/')
    if(contact.phone !== null) await db.updateContactPhone(contact.email, contact.phone)
    if(contact.secondary_phone !== null) await db.updateContactSecondaryPhone(contact.email, contact.secondary_phone)
    if(contact.extension !== null) await db.updateExtension(contact.email, contact.extension)
    if(contact.name !== null) await db.updateContactName(contact.email, contact.name)
    res.redirect('/contacts/search')
})

module.exports = router
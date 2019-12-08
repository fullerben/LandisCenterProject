const express = require('express')
      router = express.Router()
      db  = require('../db.js')

router.get('/add', async (req, res) => {
    const contacts = await db.getContacts()
    const organizations = await db.getAllOrganizations()
    res.render('addvolunteerevent', {contacts: contacts.rows, organizations: organizations.rows})
})

router.post('/add', async (req, res) => {
    let event = req.body
    const contact_email = await db.getContactEmail(req.body.event_contact_name)
    const coordinator_email = await db.getContactEmail(req.body.event_coordinator_name)
    event.contact_email = contact_email.rows[0].email
    event.coordinator = coordinator_email.rows[0].email
    await db.insertVolunteerEvents(event)
    res.redirect('/volunteerevents/all')
})

router.get('/all', async (req, res) => {
    const volunteerevents = await db.getVolunteerEvents()
    res.render('volunteerevents', {events:volunteerevents.rows})
})

router.post('/all', async (req, res) => {
    const events = await db.findVolunteerEvents(req.body.search)
    console.log(events)
    res.render('volunteerevents', {events: events.rows})
})

module.exports = router
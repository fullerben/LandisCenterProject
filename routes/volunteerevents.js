const express = require('express')
      router = express.Router()
      db  = require('../db.js')
      auth = require('../auth')

router.get('/add',  auth.authenticateUser, async (req, res) => {
    const contacts = await db.getContacts()
    const organizations = await db.getAllOrganizations()
    res.render('addvolunteerevent', {contacts: contacts.rows, organizations: organizations.rows})
})

router.post('/add', auth.authenticateUser, async (req, res) => {
    let event = req.body
    const contact_email = await db.getContactEmail(req.body.event_contact_name)
    const coordinator_email = await db.getContactEmail(req.body.event_coordinator_name)
    event.contact_email = contact_email.rows[0].email
    event.coordinator = coordinator_email.rows[0].email
    await db.insertVolunteerEvents(event)
    res.redirect('/volunteerevents/all')
})

router.get('/all', auth.authenticateUser, async (req, res) => {
    const volunteerevents = await db.getVolunteerEvents()
    res.render('volunteerevents', {events:volunteerevents.rows})
})

router.post('/all', auth.authenticateUser, async (req, res) => {
    const events = await db.findVolunteerEvents(req.body.search)
    console.log(events)
    res.render('volunteerevents', {events: events.rows})
})

router.get('/update/:id', auth.authenticateUser, async (req, res) => {
    const event = await db.getVolunteerEventsById(req.params.id)
    const current_coordinator_name = event.rows[0].coordinator
    const current_organization = event.rows[0].student_org
    const contacts = await db.getContacts()
    res.render('updatevolunteerevents', {contacts:contacts, current_coordinator_name: current_coordinator_name, current_organization: current_organization})

})

module.exports = router
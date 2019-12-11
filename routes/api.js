const express = require('express')
      router = express.Router()
      db = require('../db.js')
      auth = require('../auth')

router.get('/contacts', auth.authenticateUser, async (req, res) => {
    const contacts = await db.executeQuery('select * from contacts')
    res.json(contacts.rows)
})

router.get('/contacts/all', auth.authenticateUser, async (req, res) => {
    const contacts = await db.getContactsWithOrganizations()
    res.json(contacts.rows)
})

router.get('/volunteerevents/all', auth.authenticateUser, async (req, res) => {
    const events = await db.getVolunteerEvents()
    res.json(events.rows)
})

router.get('/volunteerprograms/all', auth.authenticateUser, async (req, res) => {
    const programs = await db.getVolunteerEvents()
    res.json(programs.rows)
})

router.get('/projects/all', auth.authenticateUser, async (req, res) => {
    const projects = await db.getProjects()
    res.json(projects.rows)
})

router.get('/facultycontacts/all', auth.authenticateUser, async (req, res) => {
    const contacts = await db.getFacultyContacts()
    res.json(contacts.rows)
})

router.get('/contacts/:project_name', auth.authenticateUser, async (req, res) => {
    const contacts = db.getContactsUsingProject(req.params.project_name)
    res.json(contacts)
})

router.get('/contacts/:org', auth.authenticateUser, async (req, res) => {
    const contacts = db.getContactsUsingOrganizationt(req.params.org)
    res.json(contacts)
})

router.get('/contacts/:program', auth.authenticateUser, async (req, res) => {
    const contacts = db.getContactsUsingVolunteerProgram(req.params.program)
    res.json(contacts)
})

router.get('/contacts/:event', auth.authenticateUser, auth.authenticateUser, async (req, res) => {
    const contacts = db.getContactsUsingVolunteerEvent(req.params.event)
    res.json(contacts)
})

router.get('/facultycontacts/:department', auth.authenticateUser, async (req, res) => {
    const contacts = db.getFacultyContactsUsingDepartment(req.params.department)
    res.json(contacts)
})

router.post('/contacts/add', auth.authenticateUser, async (req, res) => {
    const contact = req.body.contact; //This will need to be parsed later for security
    db.insertContact(contact)
    res.status(200)
})

router.get('/contacts/:name', auth.authenticateUser, async (req, res) => {
    const contact = await db.findContact(req.params.name)
    res.json(contact.rows[0])
})

router.get('/actions/all', auth.authenticateUser, async (req, res) => {
    const actions = await db.getAllActions();
    res.json(actions.rows)
})

router.get('/actions/project/:project_name', auth.authenticateUser, async (req, res) => {
    const project_actions = db.getProjectActions(req.params.project_name)
    res.json(project_actions)
})

router.get('/contacts/all', auth.authenticateUser, async (req, res) => {
    const contacts = await db.getContactsWithOrganizations()
    res.json(contacts.rows)
})

router.put( '/volunteerevents/num_students', auth.authenticateUser, async (req, res) => {
    const updateVolunteerEventsStudents = await db.updateVolunteerEventsStudents( num_students, req.params.new_num ) ;
    res.json( updateVolunteerEventsStudents )
})

router.put( '/contacts/secondary_phone', auth.authenticateUser, async (req, res) => {
    const updateContactSecondaryPhone = await db.updateContactSecondaryPhone( secondary_phone, req.params.new_sec_phone ) ;
    res.json( updateContactSecondaryPhone )
})

router.get('/actions/project/:project_name', auth.authenticateUser, async (req, res) => {
    const project_actions = db.getProjectActions(req.params.project_name)
    res.json(project_actions)
})

router.get('/contacts/get', auth.authenticateUser, async (req, res) => {
    const contact = await db.findContact(req.query.email)
    res.json(contact)
})



module.exports = router


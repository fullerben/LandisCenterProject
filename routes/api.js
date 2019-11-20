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

router.post('/contacts/add', async (req, res) => {
    const contact = req.body.contact; //This will need to be parsed later for security
    db.insertContact(contact)
    res.status(200)
})

router.get('/actions/all', async (req, res) => {
    const actions = await db.getAllActions();
    res.json(actions.rows)
})

router.get('/actions/project/:project_name', async (req, res) => {
    const project_actions = db.getProjectActions(req.params.project_name)
    res.json(project_actions)
})



module.exports = router


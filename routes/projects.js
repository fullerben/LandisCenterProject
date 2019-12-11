const express = require('express')
      router = express.Router()
      db  = require('../db.js')
      auth = require('../auth')

router.get('/add',  auth.authenticateUser, async (req, res) => {
    const contacts = await db.getContacts()
    res.render('addproject', { contacts: contacts.rows })
})

router.post('/add',  auth.authenticateUser, async (req, res) => {
    const email = await db.getContactEmail(req.body.contact_name)
    const project = {
        project_name: req.body.project_name,
        contact_email: email.rows[0].email,
        num_students: req.body.num_volunteers === '' ? null : req.body.num_volunteers
    }
    await db.insertProject(project)
    res.redirect('/projects/all')
})


router.get('/all', auth.authenticateUser, async (req, res) => {
    const projects = await db.getProjects()
    res.render('searchprojects', { projects: projects.rows })
})

router.get('/update/:id', auth.authenticateUser, async (req, res) => {
    const project = await db.getProjectById(req.params.id)
    const contacts = await db.getContacts()
    const current = await db.getContact(project.rows[0].contact_email)
    res.render('updateprojects', { project: project.rows[0], contacts: contacts.rows, current:current.rows[0] })
})

router.post('/update', auth.authenticateUser, async (req, res) => {
    const project = req.body
    await db.updateProject(project)
    res.redirect('back')
})

router.post('/search', auth.authenticateUser, async (req, res) => {
    const query = req.body.project_name
    let projects
    if(query === '') projects = await db.getProjects()
    else projects = await db.getProjectsLIKESearch(query)
    res.render('searchprojects', { projects: projects.rows })
})

module.exports = router
const express = require('express')
      router = express.Router()
      db  = require('../db.js')

router.get('/add', async (req, res) => {
    const contacts = await db.getContacts()
    res.render('addproject', { contacts: contacts.rows })
})

router.post('/add', async (req, res) => {
    const email = await db.getContactEmail(req.body.contact_name)
    const project = {
        project_name: req.body.project_name,
        contact_email: email.rows[0].email,
        num_students: req.body.num_volunteers === '' ? null : req.body.num_volunteers
    }
    await db.insertProject(project)
    res.redirect('/projects/all')
})


router.get('/all', async (req, res) => {
    const projects = await db.getProjects()
    res.render('searchprojects', { projects: projects.rows })
})

router.get('/update', (req, res) => {
    res.render('updateproject')
})

router.post('/update', async (req, res) => {
    const project = req.body
    const num_students = req.body
    await db.updateProjectStudents(project, num_students)
    res.redirect('/')
})

module.exports = router
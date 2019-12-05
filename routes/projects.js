const express = require('express')
      router = express.Router()
      db  = require('../db.js')

router.get('/search', async (req, res) => {
    const projects = await db.getProjects()
    res.render('searchprojects', { projects: projects })
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
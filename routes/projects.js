const express = require('express')
      router = express.Router()
      db  = require('../db.js')

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
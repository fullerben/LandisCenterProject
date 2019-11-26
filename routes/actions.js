const express = require('express')
      router = express.Router()
      db  = require('../db.js')

const parseAction = (action) => {
    return {
        due_date: action.due_date,
        content: action.content,
        done: false
    }
}

router.get('/add', async (req, res) => {
    const projects = await db.getProjects();
    res.render('addaction', { projects: projects.rows, partnerships: [] })
})

router.post('/add', async (req, res) => {
    const action = parseAction(req.body)
    await db.insertActions(action)
    if(action.project !== 'None') {
        // add project action
    }
    if(action.partnership !== 'None') {
        // add partnership action
    }
    res.redirect('/')
})

router.post('/complete/:id', async (req, res) => {
    await db.setActionDone(req.params.id)
    res.sendStatus(200)
})

module.exports = router
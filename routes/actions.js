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
        db.insertProjectAction({
            action_id: action.action_id,
            project: action.project
        })
    }
    if(action.partnership !== 'None') {
        db.insertPartnerAction({
            action_id: action.action_id,
            partner_name: action.partner_name
        })
    }
    res.redirect('/')
})

router.post('/complete/:id', async (req, res) => {
    await db.setActionDone(req.params.id)
    res.sendStatus(200)
})

router.get('/view', async (req, res) => {
    const projectActions = await db.getAllProjectActions()
    console.log(projectActions.rows)
    const partnerActions = await db.getAllPartnerActions()
    res.render('viewactions', { projectActions: projectActions.rows, partnerActions: partnerActions.rows })
})

module.exports = router

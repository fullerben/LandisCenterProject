const express = require('express')
      router = express.Router()
      db  = require('../db.js')
      auth = require('../auth')

router.get('/add', auth.authenticateUser, async (req, res) => {
    const projects = await db.getProjects();
    const partnerships = await db.getPartnerships()
    res.render('addaction', { projects: projects.rows, partnerships: partnerships.rows })
})

router.post('/add', auth.authenticateUser, async (req, res) => {
    let action = req.body
    await db.insertActions({
        due_date: action.due_date,
        content:action.content,
        done: false
    })
    let id = await db.getActionId(action.due_date, action.content)
    if(action.project !== 'None') {
        await db.insertProjectAction({
            action_id: id.rows[0].action_id,
            project: action.project
        })
    }
    if(action.partner_name !== 'None') {
        db.insertPartnerAction({
            action_id: id.rows[0].action_id,
            partner_name: action.partner_name
        })
    }
    res.redirect('/')
})

router.post('/complete/:id', auth.authenticateUser, async (req, res) => {
    await db.setActionDone(req.params.id)
    res.sendStatus(200)
})

router.get('/view', auth.authenticateUser, async (req, res) => {
    const projectActions = await db.getAllProjectActions()
    console.log(projectActions.rows)
    const partnerActions = await db.getAllPartnerActions()
    res.render('viewactions', { projectActions: projectActions.rows, partnerActions: partnerActions.rows })
})

module.exports = router

const express = require('express')
      router = express.Router()
      db  = require('../db.js')

// router.get('/:name', async (req, res) => {
//     const organization = await db.getOrganizationByName(req.params['name'])
//     console.log(organization.rows)
//     const contacts = await db.getOrganizationContacts(req.params['name'])
//     res.render('displayorganization', { organization: organization.rows[0], contacts: contacts.rows })
// })

router.post('/search', async (req, res) => {
    const org = req.body.org
    let orgs;
    if (org == "") {
        orgs = db.getContacts();
    }
    orgs = await db.getOrgUsingLikeOrganization(org)
    res.render('searchOrg', { orgs: orgs.rows })
})

router.get('/add', (req, res) => {
    res.render('insertorganizations')
})

router.get('/', async (req, res) => {
    const orgs = await db.getOrganizations()
    res.render('searchOrg', {orgs: orgs.rows })
})

router.get('/search', (req, res) => {
    res.render('insertorganizations')
})

router.post('/add', async (req, res) => {
    const organization = req.body
    //const contact = scrubContact(req.body) *Don't need this* 
    await db.insertOrganizations(organization)
    res.redirect('/')
})

module.exports = router
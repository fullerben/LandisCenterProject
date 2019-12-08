const express = require('express')
      router = express.Router()
      db  = require('../db.js')
      auth = require('../auth')

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
    let organization = req.body
    organization.organization_type = organization.organization_type.toLowerCase()
    await db.insertOrganizations(organization)
    res.redirect('/organizations')
})

router.get('/update/:id', async (req, res) => {
    const org = await db.getOrganizationById(req.params.id)
    res.render('updateorganization', {organization: org.rows[0]})
})

router.post('/update', async (req, res) => {
    let organization = req.body
    organization.organization_type = req.body.organization_type.toLowerCase()
    await db.updateOrganization(organization)
    res.redirect('/')
})

router.get('/view/:id', async (req, res) => {
    const id = req.params.id
    const organization = await db.getOrganizationById(id)
    const contacts = await db.getOrganizationContacts(id)
    const allcontacts = await db.getContacts()
    res.render('vieworganization', { organization: organization.rows[0], contacts: contacts.rows, allContacts:allcontacts.rows })
})

router.post('/contacts/remove/:contact/:organization', async (req, res) => {
    await db.removeOrganizationContact(req.params.contact, req.params.organization)
    res.redirect('back')
})

router.post('/contacts/add/:org_id', async (req,res) => {
    await db.addOrganizationContact(req.body.contact_name, req.params.org_id)
    res.redirect('back')
})

module.exports = router
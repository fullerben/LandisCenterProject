const express = require('express')
      router = express.Router()
      db  = require('../db.js')

router.get('/:name', async (req, res) => {
    const organization = await db.getOrganizationByName(req.params['name'])
    console.log(organization.rows)
    const contacts = await db.getOrganizationContacts(req.params['name'])
    res.render('displayorganization', { organization: organization.rows[0], contacts: contacts.rows })
})

module.exports = router
const express = require('express')
      router = express.Router()
      db  = require('../db.js')

router.get('/', async (req, res) => {
    const contacts = await db.getContactsWithOrganizations()
    res.render('index', { contacts: contacts.rows })
})

router.get('/add/:type', async (req, res) => {
    const type = req.params.type
    let items
    switch(type) {
        case 'contacts':
            items = await db.executeQuery('select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME=\'contacts\'')
            console.log(items)
            break;
    }

    res.render('admin/insert', { formItems: items.rows })
})

module.exports = router
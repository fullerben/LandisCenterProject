const { Pool, Client } = require('pg')

// Don't push actual credentials, these are just for testing
// Real credentials should be in a separate file
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DB,
    password: process.env.DB_PASSWD,
    port: 5432,
})

const queryTemplate = (queryString, params) => {
    const query = {
        text: queryString,
        values: params === undefined ? [] : params
    }

    return pool.query(query)
               .then(data => {
                   return data
               })
               .catch(e => console.log(e))
}

module.exports = {
    executeQuery: (queryString, params) => {
        return queryTemplate(queryString, params)
    },
    getContactsWithOrganizations: () => {
        return queryTemplate('select * from contacts join organizationcontacts on contacts.email=organizationcontacts.contact_email order by name')
    },
    getAllActions: () => {
        return queryTemplate('select * from actions')
    },
    getProjectActions: () => {
        return queryTemplate('select * from actionprojects join projects on actionprojects.project=projects.name join actions on actionprojects.action_id=actions.action_id')
    },
    getProjectActions: (project) => {
        return queryTemplate('select * from actions join actionprojects on actions.action_id=actionprojects.action_id where project=$1', [project])
    },
    insertContact: (contact) => {
        return queryTemplate('insert into contacts values($1,$2,$3,$4,$5)', [contact.name, contact.email, contact.phone, contact.secondary_phone, contact.extension])
    },
    getMostRecentActions: () => {
        return queryTemplate("select project_name, TO_CHAR(due_date :: DATE, 'Mon dd, yyyy') as due_date, content from projectactions join actions on actions.action_id=projectactions.action_id join projects on project=project_name order by due_date limit 5")
    }
}
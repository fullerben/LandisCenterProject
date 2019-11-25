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
    getVolunteerPrograms: () {
    	return queryTemplate('select * from volunteerprograms')
    },
    getVolunteerEvents: () {
    	return queryTemplate('select * from volunteerEvents')
    },  
    getProjects: () {
    	return queryTemplate('select * from projects')
    },  
    getContactsWithOrganizations: () => {
        return queryTemplate('select * from contacts join organizationcontacts on contacts.email=organizationcontacts.contact_email')
    },
    getFacultyContacts: () => {
        return queryTemplate('select * from facultycontacts')
    }
    getFacultyContactsUsingDepartment: (department) {
    	return queryTemplate('select * from facultycontacts where department = $1', [department])
    },
    getContactsUsingOrganization: (org) {
    	return queryTemplate('select * from contacts join organizationcontacts on contacts.email=organizationcontacts.contact_email where organization = $1', [org])
    },
    getContactsUsingProject: (name) {
    	return queryTemplate('select * from contacts join projects on contacts.email=projects.contact_email where project_name = $1', [name])
    },  
    getContactsUsingVolunteerProgram: (name) {
    	return queryTemplate('select * from contacts join volunteerprograms on contacts.email=volunteerprograms.contact_email where project_name = $1', [name])
    },
    getContactsUsingVolunteerEvent: (name) {
    	return queryTemplate('select * from contacts join volunteerevents on contacts.email=volunteerevents.contact_email where event_name = $1', [name])
    },
    getAllActions: () => {
        return queryTemplate('select * from actions')
    },
    getProjectActions: (project) => {
        return queryTemplate('select * from actions join actionprojects on actions.action_id=actionprojects.action_id where project=$1', [project])
    },
    insertContact: (contact) => {
        return queryTemplate('insert into contacts values($1,$2,$3,$4,$5)', [contact.name, contact.email, contact.phone, contact.secondary_phone, contact.extension])
    },
}
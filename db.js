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
    getVolunteerPrograms: () => {
    	return queryTemplate('select * from volunteerprograms')
    },
    getVolunteerEvents: () => {
    	return queryTemplate('select * from volunteerEvents')
    },  
    getProjects: () => {
    	return queryTemplate('select * from projects')
    },  
    getContactsWithOrganizations: () => {
        return queryTemplate('select * from contacts join organizationcontacts on contacts.email=organizationcontacts.contact_email order by name')
    },
    getFacultyContacts: () => {
        return queryTemplate('select * from facultycontacts')
    },
    getFacultyContactsUsingDepartment: (department) => {
    	return queryTemplate('select * from facultycontacts where department = $1', [department])
    },
    getContactsUsingOrganization: (org) => {
    	return queryTemplate('select * from contacts join organizationcontacts on contacts.email=organizationcontacts.contact_email where organization = $1', [org])
    },
    getContactsUsingProject: (name) => {
    	return queryTemplate('select * from contacts join projects on contacts.email=projects.contact_email where project_name = $1', [name])
    },  
    getContactsUsingVolunteerProgram: (name) => {
    	return queryTemplate('select * from contacts join volunteerprograms on contacts.email=volunteerprograms.contact_email where project_name = $1', [name])
    },
    getContactsUsingVolunteerEvent: (name) => {
    	return queryTemplate('select * from contacts join volunteerevents on contacts.email=volunteerevents.contact_email where event_name = $1', [name])
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
    },
    insertContact: (contact) => {
        return queryTemplate('insert into contacts values($1,$2,$3,$4,$5)', [contact.name, contact.email, contact.phone, contact.secondary_phone, contact.extension])
    },
    insertFacultyContacts: (facultycontacts) => {
        return queryTemplate('insert into facultycontacts values($1,$2,$3)', [facultycontacts.email, facultycontacts.department, facultycontacts.involvement_type])
    },
    insertVolunteerPrograms: (volunteerprograms) => {
        return queryTemplate('insert into volunteerprograms values($1,$2,$3,$4)', [volunteerprograms.program_id, volunteerprograms.host_organization, volunteerprograms.partner_organization, volunteerprograms.contact_email])
    },
    insertVolunteerEvents: (volunteerevents) => {
        return queryTemplate('insert into volunteerevents values($1,$2,$3,$4,$5,$6)', [volunteerevents.event_name, volunteerevents.event_date, volunteerevents.host_organization, volunteerevents.contact_email, volunteerevents.coordinator_email,volunteerevents.num_volunteers])
    },
    insertOrganizations: (organizations) => {
        return queryTemplate('insert into organizations values($1,$2)', [organizations.organization_name, organizations.organization_type])
    },
    insertOrganizationContacts: (organizationcontacts) => {
        return queryTemplate('insert into organizationcontacts values($1,$2)', [organizationcontacts.organization_name, organizationcontacts.contact_email])
    },
    insertPartnerships: (partnerships) => {
        return queryTemplate('insert into partnerships values($1,$2,$3)', [partnerships.project_name, partnerships.faculty_contact, partnerships.partner_organization])
    },
    
    insertActions: (actions) => {
        return queryTemplate('insert into actions (due_date, content) values($1,$2,$3)', [actions.action_id, actions.due_date, actions.content])
    },
    insertPartnerActions: (partneractions) => {
        return queryTemplate('insert into partneractions values($1,$2)', [partneractions.partner_name, partnerships.action.id])
    },
    insertVolunteerActions: (volunteeractions) => {
        return queryTemplate('insert into volunteeractions (partner_name, action_id) values($1,$2)', [volunteeractions.partner_name, volunteeractions.action.id])
    },
}

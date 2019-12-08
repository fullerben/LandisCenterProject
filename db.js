const { Pool, Client } = require('pg')

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
    	return queryTemplate('select event_name, description, event_date, num_volunteers, student_org, coordinator, contact_email, a.id as contact_id, b.id as coordinator_id from volunteerEvents left join contacts as a on a.email=volunteerevents.contact_email left join contacts as b on b.name=volunteerevents.coordinator order by event_name')
    },
    findVolunteerEvents: (query) => {
        return queryTemplate(`select event_name, description, event_date, num_volunteers, student_org, coordinator, contact_email, a.id as contact_id, b.id as coordinator_id from volunteerEvents left join contacts as a on a.email=volunteerevents.contact_email left join contacts as b on b.name=volunteerevents.coordinator where event_name ilike '%${query}%' order by event_name`)
    },
    getUpcomingVolunteerEventsWithContact: () => {
        return queryTemplate(`select event_name, contacts.name, contact_email, id as contact_id, TO_CHAR(event_date :: DATE, 'Mon dd, yyyy') as event_date from volunteerevents join contacts on volunteerevents.contact_email=contacts.email order by event_date limit 5`)
    },
    getProjects: () => {
    	return queryTemplate('select id as contact_id, project_name, num_students, contacts.name as contact_name from projects join contacts on projects.contact_email=contacts.email')
    },  
    getContactsWithOrganizations: () => {
        return queryTemplate('select * from contacts left outer join organizationcontacts on contacts.email=organizationcontacts.contact_email order by name')
    },
    getContacts: () => {
        return queryTemplate('select * from contacts order by name')
    },
    getFacultyContacts: () => {
        return queryTemplate('select contacts.email, contacts.name, facultycontacts.department  from facultycontacts, contacts where contacts.email = facultycontacts.email')
    },
    getFacultyContactUsingDepartment: (department) => {
        let likename = '%' + department + '%';
    	return queryTemplate('select contacts.email, contacts.name, facultycontacts.department from facultycontacts, contacts where contacts.email = facultycontacts.email AND facultycontacts.department ILIKE $1', [likename])
    },
    getContactsUsingOrganization: (org) => {
    	return queryTemplate('select * from contacts join organizationcontacts on contacts.email=organizationcontacts.contact_email where organization = $1', [org])
    },
    getContactsUsingName: (name) => {
    	return queryTemplate('select * from contacts join organizationcontacts on contacts.email=organizationcontacts.contact_email where name = $1', [name])
    },
    getOrgUsingLikeOrganization: (org) => {
        let likename = '%' + org + '%';
    	return queryTemplate('select * from organizations where organization_name ILIKE $1 order by organization_name', [likename])
    },
    getContactsUsingLIKEName: (name) => {
        return queryTemplate(`select * from contacts join organizationcontacts on contacts.email=organizationcontacts.contact_email where name ILIKE '%${name}%'`)
    },
    getContactUsingLikeName: (name) => {
        let likename = '%' + name + '%';
    	return queryTemplate("select * from contacts where name ILIKE $1 order by name", [likename])
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
    insertProject: (project) => {
        return queryTemplate('insert into projects values($1,$2,$3)', [project.contact_email,project.project_name,project.num_students])
    },
    insertContact: (contact) => {
        return queryTemplate('insert into contacts values($1,$2,$3,$4,$5)', [contact.name, contact.email, contact.phone, contact.secondary_phone, contact.extension])
    },
    getMostRecentActions: () => {
        return queryTemplate(`select actions.action_id, TO_CHAR(due_date :: DATE, 'Mon dd, yyyy') as due_date, content from actions where done=false order by due_date limit 5`)
    },
    getMostRecentProjectActions: () => {
        return queryTemplate("select actions.action_id, project_name, TO_CHAR(due_date :: DATE, 'Mon dd, yyyy') as due_date, content from projectactions join actions on actions.action_id=projectactions.action_id join projects on project=project_name where done=false order by due_date limit 5")
    },
    insertFacultyContacts: (facultycontacts) => {
        return queryTemplate('insert into facultycontacts values($1,$2)', [facultycontacts.email, facultycontacts.department])
    },
    insertVolunteerPrograms: (volunteerprograms) => {
        return queryTemplate('insert into volunteerprograms values($1,$2,$3,$4)', [volunteerprograms.program_id, volunteerprograms.host_organization, volunteerprograms.partner_organization, volunteerprograms.contact_email])
    },
    insertVolunteerEvents: (volunteerevents) => {
        return queryTemplate('insert into volunteerevents (event_name,event_date, description,student_org, contact_email,coordinator, num_volunteers) values($1,$2,$3,$4,$5,$6,$7)', [volunteerevents.event_name, volunteerevents.event_date, volunteerevents.description, volunteerevents.host_organization, volunteerevents.contact_email, volunteerevents.coordinator_email,volunteerevents.num_volunteers])
    },
    insertOrganizations: (organizations) => {
        return queryTemplate('insert into organizations values($1,$2)', [organizations.organization_name, organizations.organization_type])
    },
    insertOrganizationContacts: (organizationcontacts) => {
        return queryTemplate('insert into organizationcontacts values($1,$2)', [organizationcontacts.organization_name, organizationcontacts.contact_email])
    },
    addOrganizationContact: (contact_name, organization_id) => {
        return queryTemplate('insert into organizationcontacts (organization_name, contact_email) values ((select organization_name from organizations where id=$1), (select email from contacts where name=$2))', [organization_id, contact_name])
    },
    insertPartnerships: (partnerships) => {
        return queryTeCmplate('insert into partnerships values($1,$2,$3)', [partnerships.project_name, partnerships.faculty_contact, partnerships.partner_organization])
    },
    insertActions: (actions) => {
        return queryTemplate('insert into actions (due_date, content, done) values($1,$2,$3)', [actions.due_date, actions.content, actions.done])
    },
    insertPartnerAction: (partneractions) => {
        return queryTemplate('insert into partneractions (partnership, action_id) values($1,$2)', [partneractions.partner_name, partnerships.action_id])
    },
    insertProjectAction: (action) => {
        return queryTemplate('insert into projectactions (action_id, project) values ($1, $2)', [action.action_id, action.project])
    },
    getOrganizationByName: (name) => {
        return queryTemplate('select organizations.organization_name, organization_type from organizations where organizations.organization_name=$1', [name])
    },
    getOrganizationById: (id) => {
        return queryTemplate('select * from organizations where id=$1', [id])
    },
    getAllOrganizations: () => {
        return queryTemplate('select * from organizations order by organization_name')
    },
    getOrganizations: () => {
        return queryTemplate('select * from organizations');
    },
    getOrganizationContacts: (id) => {
        return queryTemplate(`select contacts.name, contacts.id, contacts.email from contacts natural join (select contact_email as email from organizationcontacts where organization_name=(select organization_name from organizations where id=${id})) as a`)
    },
    removeOrganizationContact: (contact, org) => {
        return queryTemplate(`delete from organizationcontacts where organization_name=(select organization_name from organizations where id=$1) and contact_email=(select email from contacts where id=$2)`, [org, contact])
    },
    getProjectActions: (project) => {
        return queryTemplate('select * from actions join actionprojects on actions.action_id=actionprojects.action_id where project=$1', [project])
    },
    getAllPartnerActions: () => {
        return queryTemplate('select * from actions natural join partneractions natural join partnerships')
    },
    getAllProjectActions: () => {
        return queryTemplate('select * from projectactions natural join projects join contacts on projects.contact_email=contacts.email')
    },
    getActionId: (date, content) => {
        return queryTemplate('select action_id from actions where due_date=$1 and content=$2', [date, content])
    },
    insertContact: (contact) => {
        return queryTemplate('insert into contacts values($1,$2,$3,$4,$5)', [contact.name, contact.email, contact.phone, contact.secondary_phone, contact.extension])
    },
    updateActions: (action_id, new_content) => {
        return ( 'UPDATE Actions SET content = $1 WHERE action_id = $2', [new_content, action_id] )
    },
    updateOrganization: (organization) => {
        return queryTemplate('update organizations set organization_name=$1, organization_type=$2', [organization.organization_name, organization.organization_type])
    },
    setActionDone: (action_id) => {
        return queryTemplate('update actions set done=TRUE where action_id=$1', [action_id])
    },
    updateContactName: (email, name) => {
        return queryTemplate('update contacts set name=$1 where email=$2', [name, email])
    },
    updateContactPhone: (email, new_phone) => {
        return queryTemplate( 'UPDATE Contacts SET phone = $1 WHERE email = $2', [new_phone, email] )
    },
    updateContactSecondaryPhone: (email, new_sec_phone) => {
        return queryTemplate( 'UPDATE Contacts SET secondary_phone = $1 WHERE email = $2', [new_sec_phone, email ] )
    },
    updateExtension: (email, new_ext) => {
        return queryTemplate( 'UPDATE Contacts SET extension = $1 WHERE email = $2', [new_ext, email] )
    },
    updateProjectStudents: (project_name, new_num) => {
        return queryTemplate( 'UPDATE Projects SET num_students = $1 WHERE project_name = $2', [new_num, project_name ] )
    },
    updateVolunteerEventsStudents: (event_name, event_date, new_num) => {
        return queryTemplate( 'UPDATE VolunteerEvents SET num_students = $1 WHERE event_name = $2 AND event_date = $3', [new_num, event_name, event_date] )
    },
    getContact: (email) => {
        return queryTemplate(`select * from contacts where email=$1`, [email])
    },
    getContactById: (id) => {
        return queryTemplate('select contacts.email, contacts.name, contacts.phone, contacts.secondary_phone, contacts.extension, facultycontacts.department, contacts.id from contacts left outer join facultycontacts on contacts.email=facultycontacts.email where contacts.id=$1', [id])
    },
    getContactEmail: (name) => {
        return queryTemplate('select * from contacts where name=$1', [name])
    },
    getPartnerships: () => {
        return queryTemplate('select * from partnerships order by partnership_name')
    },
    getUserById: (id) => {
        return queryTemplate('select * from users where username=$1', [id])
    },
    getUser: (username) => {
        return queryTemplate('select * from users where username=$1', [username])
    },
    addUser: (user) => {
        return queryTemplate('insert into users (username, password, name, email, admin) values($1,$2,$3,$4,$5)', [user.username, user.password, user.name, user.email, false])
    },
    getPartnerActions: (id) => {
        return queryTemplate('select actions.content, actions.due_date from actions, partneractions, partnerships, organizations where organizations.id = $1 AND actions.action_id = partneractions.action_id AND partneractions.partnership = partnerships.partnership_name AND partnerships.partner_organization = organizations.organization_name', [id])
    },
    getProjectActions: (id) => {
        return queryTemplate('select actions.content, actions.due_date from actions, projectactions, projects where organizations.id = $1 AND actions.action_id = partneractions.action_id AND projectactions.project = projects.project_name', [id])
    }
}

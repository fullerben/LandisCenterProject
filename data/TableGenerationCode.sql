CREATE TABLE Contacts (
    name varchar(255),
    email varchar(255) NOT NULL,
    phone varchar(12),
    secondary_phone varchar(12),
    extension varchar(12),
    PRIMARY KEY (email)
);

CREATE TABLE FacultyContacts (
    email varchar(255) NOT NULL,
    department varchar(255) NOT NULL,
    PRIMARY KEY (email),
    FOREIGN KEY (email) REFERENCES Contacts(email)
);

CREATE TABLE VolunteerEvents (
    event_date timestamp NOT NULL,
    event_name varchar(255) NOT NULL, 
    contact_email varchar(255), 
    num_volunteers int,           
    student_org varchar(255), 
    coordinator varchar(255),     
    PRIMARY KEY (event_name, event_date),    
    FOREIGN KEY (contact_email) REFERENCES Contacts(email));

CREATE TABLE Projects (
    contact_email varchar(255) NOT NULL,
    project_name varchar(255) NOT NULL,
    num_students int,
    PRIMARY KEY (project_name),
    FOREIGN KEY (contact_email) REFERENCES Contacts(email)
);

CREATE TABLE VolunteerEvents (
    event_name varchar(255) NOT NULL,
    event_date timestamp NOT NULL,
    host_organization varchar(255) NOT NULL,
    contact_email varchar(255) NOT NULL,
    coordinator_email varchar(255) NOT NULL,
    num_volunteers int,
    description text,
    PRIMARY KEY (event_name, event_date),
    FOREIGN KEY (host_organization) REFERENCES Organizations(organization_name),
    FOREIGN KEY (contact_email) REFERENCES Contacts(email)
);

CREATE TABLE Organizations (
    organization_name varchar(255) NOT NULL,
    organization_type varchar(255) check (organization_type in ('student','community')),
    PRIMARY KEY (organization_name),
);

CREATE TABLE OrganizationContacts (
    organization_name varchar(255) NOT NULL,
    contact_email varchar(255) NOT NULL,
    PRIMARY KEY (organization_name, contact_email),
    FOREIGN KEY (organization_name) REFERENCES Organizations(organization_name),
    FOREIGN KEY (contact_email) REFERENCES Contacts(email)
);

CREATE TABLE Actions (
    action_id serial NOT NULL,
    due_date timestamp NOT NULL,
    content varchar(2048),
    done boolean,
    PRIMARY KEY (action_id)
);

CREATE TABLE ProjectActions (
    action_id int NOT NULL,
    project varchar(255) NOT NULL,
    FOREIGN KEY (action_id) REFERENCES actions(action_id),
    FOREIGN KEY (project) REFERENCES projects(project_name)
);

CREATE TABLE PartnerActions (
    action_id int NOT NULL,
    partnership varchar(255) NOT NULL,
    FOREIGN KEY (action_id) REFERENCES actions(action_id),
    FOREIGN KEY (partnership) REFERENCES partnerships(partnership_name)
);

CREATE TABLE Partnerships (
    partnership_name varchar(255) NOT NULL,
    partner_organization varchar(255),
    PRIMARY KEY (partnership_name),
    FOREIGN KEY (partner_organization) REFERENCES Organizations(organization_name)
);

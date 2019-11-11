const { Pool, Client } = require('pg')

// Don't push actual credentials, these are just for testing
// Real credentials should be in a separate file
const pool = new Pool({
    user: 'me',
    host: 'localhost',
    database: 'api',
    password: 'password',
    port: 5432,
})

const executeQuery = (queryString, cb) => {
    pool.query(queryString, (err, results) => {
        if(err) {
            console.log(err)
        } else {
            cb(results)
        }
    })
}

module.exports = executeQuery
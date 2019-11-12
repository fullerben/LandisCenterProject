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

module.exports = {
    executeQuery: (queryString) => {
        return pool.query(queryString)
                .then(data => {
                    return data
                })
                .catch(e => console.log(e))
    }
}
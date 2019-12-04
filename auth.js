const passport = require('passport')

const authenticateUser = (req, res, next) => {
    if(req.user) return next()
    res.status(404).send('Please login to continue.')
}

module.exports = { authenticateUser }
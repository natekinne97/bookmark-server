const { API_TOKEN } = require('./config')
const logger = require('./logger')
// Validate authentication
function validateBearerToken(req, res, next) {
    const authToken = req.headers.key;
    // log errors
    logger.error(`Unauthorized request to path: ${req.path}`)

    if (!authToken || authToken.split(' ')[1] !== API_TOKEN) {
        // display error message
        return res.status(401).json({ error: 'Unauthorized request' })
    }

    next()
}

module.exports = validateBearerToken
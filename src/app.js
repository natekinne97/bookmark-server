require('dotenv').config()
// express
const express = require('express')
// loggin
const morgan = require('morgan')
// cors
const cors = require('cors')
// error handling
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const validateBearerToken = require('./validation')
// bookmark routes
const bookmarksRouter = require('./routes/bookmark-routes')

const app = express()
// setup loggin
app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
    skip: () => NODE_ENV === 'test'
}))


app.use(cors())
// authentication
app.use(helmet())
// app.use(validateBearerToken)
// using routes
app.use(bookmarksRouter)

// base test
app.get('/', (req, res) => {
    res.send('Hello, world!')
})

// app.use(errorHandler);

module.exports = app
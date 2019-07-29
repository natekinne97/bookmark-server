require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const validateBearerToken = require('./validation')
const errorHandler = require('./error-middleware')
const bookmarksRouter = require('./routes/bookmark-routes')

const app = express()

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
    skip: () => NODE_ENV === 'test'
}))
app.use(cors())
app.use(helmet())
app.use(validateBearerToken)

app.use(bookmarksRouter)

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

app.use(errorHandler);

module.exports = app
const express = require('express')
const uuid = require('uuid/v4')
const { isWebUri } = require('valid-url')
const logger = require('../logger')
const store = require('../bookmark')

const bookmarksRouter = express.Router()
const bodyParser = express.json()

// get request at /bookmarks
// displays all the bookmarks
bookmarksRouter
    .route('/bookmarks')
    .get((req, res) => {
        // show bookmarks
        res.json(store.bookmarks)
    })//Post request
    .post(bodyParser, (req, res) => {
        // basically a forEach loop
        for (const field of ['title', 'url', 'rating']) {
            // check if field exists
            if (!req.body[field]) {
                // if error log it
                logger.error(`${field} is required`)
                return res.status(400).send(`'${field}' is required`)
            }
        }
        // get contents from form
        const { title, url, description, rating } = req.body
        // classify the rating
        if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
            logger.error(`Invalid rating '${rating}' supplied`)
            return res.status(400).send(`'rating' must be a number between 0 and 5`)
        }
        // check if valid url
        if (!isWebUri(url)) {
            logger.error(`Invalid url '${url}' supplied`)
            return res.status(400).send(`'url' must be a valid URL`)
        }
        // create book mark basics
        const bookmark = { id: uuid(), title, url, description, rating }
        // add bookmark to store
        store.bookmarks.push(bookmark)
        // log book mark created
        logger.info(`Bookmark with id ${bookmark.id} created`)
        res
            .status(201)
            .location(`http://localhost:8000/bookmarks/${bookmark.id}`)
            .json(bookmark)
    })

    // displays bookmark by id
bookmarksRouter
    .route('/bookmarks/:bookmark_id')
    .get((req, res) => {
        const { bookmark_id } = req.params

        const bookmark = store.bookmarks.find(c => c.id == bookmark_id)

        if (!bookmark) {
            logger.error(`Bookmark with id ${bookmark_id} not found.`)
            return res
                .status(404)
                .send('Bookmark Not Found')
        }

        res.json(bookmark)
    })  //delete bookmark by id
    .delete((req, res) => {
        const { bookmark_id } = req.params

        const bookmarkIndex = store.bookmarks.findIndex(b => b.id === bookmark_id)

        if (bookmarkIndex === -1) {
            logger.error(`Bookmark with id ${bookmark_id} not found.`)
            return res
                .status(404)
                .send('Bookmark Not Found')
        }

        store.bookmarks.splice(bookmarkIndex, 1)

        logger.info(`Bookmark with id ${bookmark_id} deleted.`)
        res
            .status(204)
            .end()
    })

module.exports = bookmarksRouter
const express = require('express')
const { isWebUri } = require('valid-url')
const xss = require('xss')
const logger = require('../logger')
const BookmarkService = require('./bookmark-service')

const bookmarksRouter = express.Router()
const bodyParser = express.json()

// sanitize and configure bookmark to add or read
const serializeBookmark = bookmark => ({
    id: bookmark.id,
    title: xss(bookmark.title),
    url: bookmark.url,
    description: xss(bookmark.description),
    rating: Number(bookmark.rating),
})
// get request
bookmarksRouter
    .route('/bookmarks')
    .get((req, res, next) => {
        BookmarkService.getAllbookmarks(req.app.get('db'))
            .then(bookmarks => {
                // display all bookmarks
                res.json(bookmarks.map(serializeBookmark))
            })
            .catch(next)
    })//post request insert to database
    .post(bodyParser, (req, res, next) => {
        // validates the bookmark
        BookmarkService.validateBookmark(req, res);
        // get the data
        const { title, url, description, rating } = req.body
 
        // combine the data
        const newBookmark = { title, url, description, rating }
        // insert the data into the database
        BookmarkService.insertBookmark(
            req.app.get('db'),
            newBookmark
        )
            .then(bookmark => {
                // log the info
                logger.info(`Card with id ${bookmark.id} created.`)
                res
                    .status(201)
                    .location(`/bookmarks/${bookmark.id}`)
                    // sanitize bookmark and configure it
                    .json(serializeBookmark(bookmark))
            })
            .catch(next)
    })

// get bookmark by id 
bookmarksRouter
    .route('/api/bookmarks/:bookmark_id')
    // what does the .all mean?
    .all((req, res, next) => {
        const { bookmark_id } = req.params
        BookmarkService.getById(req.app.get('db'), bookmark_id)
            .then(bookmark => {
                // check if id exists
                if (!bookmark) {
                    logger.error(`Bookmark with id ${bookmark_id} not found.`)
                    return res.status(404).json({
                        error: { message: `Bookmark Not Found` }
                    })
                }
                // display bookmark
                res.bookmark = bookmark
                next()
            })
            .catch(next)

    })
    .get((req, res) => {
        res.json(serializeBookmark(res.bookmark))
    })//delete 
    .delete((req, res, next) => {
        // TODO: update to use db
        const { bookmark_id } = req.params
        BookmarkService.deleteBookmark(
            req.app.get('db'),
            bookmark_id
        )
            .then(numRowsAffected => {
                logger.info(`Card with id ${bookmark_id} deleted.`)
                res.status(204).end()
            })
            .catch(next)
    })

// updating bookmark
bookmarksRouter
    .route('/api/bookmarks/update/:id')
    .patch((req, res, next) => {
        const { title, url, description, rating } = req.body;
        const updatedBookmark = { title, url, description, rating };
        // check if rating is integer
        if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
            logger.error(`Invalid rating '${rating}' supplied`)
            return res.status(400).send(`'rating' must be a number between 0 and 5`)
        }
        // insure the url is correct
        if (!isWebUri(url)) {
            logger.error(`Invalid url '${url}' supplied`)
            return res.status(400).send(`'url' must be a valid URL`)
        }


        if (!title && !description && !url && !ratiing) {
            logger.error('No params supplied');
            return res.status(400).send('Not enough parameters');
        }

        //  update bookamrk
        BookmarkService.updateBookmark(
            req.app.get('db'),
            id,
            serializeBookmark(updatedBookmark)
        ).then(bookmark => {
            if (!bookmark) {
                logger.info(`Card with id ${bookmark_id} has been updated.`)
                res.status(204).end()
            }
            res.status(200).send('OK');
            next();
        }).catch(next);


    });


module.exports = bookmarksRouter
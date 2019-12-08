const BookmarksService = {
    getAllbookmarks(knex) {
        return knex.select('*').from('bookmark')
    },
    getById(knex, id) {
        return knex.from('bookmark').select('*').where('id', id).first()
    },
    insertBookmark(knex, newBookmark) {
        return knex
            .insert(newBookmark)
            .into('bookmark')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    deleteBookmark(knex, id) {
        return knex('bookmark')
            .where({ id })
            .delete()
    },
    updateBookmark(knex, id, newBookmarkFields) {
        return knex('bookmark')
            .where({ id })
            .update(newBookmarkFields)
    },
    validateBookmark(req, res){
        for (const field of ['title', 'url', 'rating']) {
            if (!req.body[field]) {
                logger.error(`${field} is required`)
                return res.status(400).send(`'${field}' is required`)
            }
        }
        const { title, url, description, rating } = req.body
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
    }
}

module.exports = BookmarksService;
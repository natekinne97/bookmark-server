const app = require('./app')
const knex = require('knex');
const { PORT, DB_URL } = require('./config')

// connect to db
const db = knex({
    client: 'pg',
    connection: DB_URL
});

app.set('db', db);

// listen to port or initiate server
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})
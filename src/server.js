const app = require('./app')
const { PORT } = require('./config')
// listen to port or initiate server
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})
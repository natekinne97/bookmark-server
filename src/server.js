const app = require('./app')
const { PORT } = require('./config')


app.get('/', function(req, res){
    res.send('Hello, world!');
});

// start server
const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})
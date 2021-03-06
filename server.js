const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/find_fit');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
const PORT = process.env.PORT || 3000;
const db = mongoose.connection;
app.use(express.static('public'));

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to mongo');
});

app.use('/api', require('./app/api/index'));

app.listen(PORT, () => {
    console.log('server start http://localhost:' + PORT);
});

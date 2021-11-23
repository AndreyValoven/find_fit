const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'));


// app.use('/api', require('./app/api/index'));

app.listen(PORT, () => {
    console.log('server start http://localhost:' + PORT);
});

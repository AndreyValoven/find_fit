const api = require('express').Router();

api.post('/registration', require('./user'));


module.exports = api;
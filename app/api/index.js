const api = require('express').Router();

api.use('/user', require('./user'));


module.exports = api;
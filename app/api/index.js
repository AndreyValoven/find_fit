const api = require('express').Router();

api.use('/user', require('./user'));

api.use('/login', require('./login'));
api.use('/registration', require('./registration'));
api.use('/event', require('./event'));
api.use('/events', require('./events'));

module.exports = api;
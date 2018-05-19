const user = require('express').Router();

const validteToken = require('./../validateToken');
const User = require('./../schemas/user');


user.get('/:id', (req, res) => {
    User.findOne( { _id: req.params.id})
        .then(user => {
            res.json({ user });
        })
});

user.delete('/:id', validteToken, (req, res) => {
    if (req.id + '' !== req.params.id+ '') {
        return res.status(403).json({ erorr: 'Forbidden'});
    }
    User.findByIdAndRemove(req.id ,(error, user) => {
        if(error)
            return res.json({ error });
        res.json({
            user
        });
    });
});

module.exports = user;
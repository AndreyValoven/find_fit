const registration = require('express').Router();
const Ajv = require('ajv');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = require('./../schemas/user');

let ajv = new Ajv({ allErrors: true });

const registrationSchema = {
    type: 'object',
    additionaProperties: false,
    properties: {
        name: { type: 'string' , minLength: 1},
        sport_type: { type: 'string' , minLength: 1},
        number: { type: 'number' },
        link: { type: 'string' }
    },
    required: [ 'name' ]
}

const registrationValidate = ajv.compile(registrationSchema);

registration.post('/', 
    (req, res, next) => {
        if (!registrationValidate(req.body)) return res.status(500).json({ error: registrationValidate.errors });
        next();
    },
    (req, res) => {
        let body = req.body;
        let user = new User({
            _id: mongoose.Types.ObjectId(),
            name: req.body.name,
            contacts: {
                number: body.number,
                link: body.link
            }
        })

        user.save()
            .then(user => {
                let token = jwt.sign( { id: user._id , name: user.name }, 'shh' );
                res.json({ 
                    token,
                    name: user.name,
                    id: user._id
                });
            })
            .catch(error => res.status(500).json({ error }));
    });

module.exports = registration;
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
        // sport_type: [{ type: 'string' , minLength: 1}],
        number: { type: 'number' },
        link: { type: 'string' },
        sex: { type: 'string' },
        age: { type: 'number' },
        goal: { type: 'string' },
        height: { type: 'number' },
        weight: { type: 'number' }
    },
    required: [ 'name' ]
}

const registrationValidate = ajv.compile(registrationSchema);

registration.post('/', 
    (req, res, next) => {
        if (!registrationValidate(req.body)) return res.status(400).json({ error: registrationValidate.errors });
        next();
    },
    (req, res) => {
        let body = req.body;
        let user = new User({
            _id: mongoose.Types.ObjectId(),
            name: body.name,
            sport_type: body.sport_type,
            contacts: {
                number: body.number,
                link: body.link
            },
            info: {
                sex: body.sex,
                age: body.age,
                goal: body.goal,
                height: body.height,
                weight: body.weight
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
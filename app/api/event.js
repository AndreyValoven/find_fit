const event = require('express').Router();
const mongoose = require('mongoose');
const Ajv = require('ajv');

const checkToken = require('./../validateToken');
const Event = require('./../schemas/event');

const ajv = new Ajv({ allErrors: true });

const eventType = {
    type: 'object',
    additionaPropertise: false,
    properties: {
        name: { type: 'string', minLength: 1 },
        type: { type: 'string', minLength: 1},
        goal: { type: 'string' },
        place: { 
            lat: { type: 'number' },
            tng: { type: 'number' }
        }
    }
}

const eventValidate = ajv.compile(eventType);

// create event
event.post('/create', checkToken, (req, res) => {
    if (typeof(req.id) === 'undefined')
        return res.status(403).json({ erorr: 'Forbidden'});
    if (!eventValidate(req.body)) 
        return res.status(500).json({ error: eventValidate})
    
    let newEvent = new Event({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        user_id: req.id,
        goal: req.body.goal,
        place: {
            lat: req.body.place.lat,
            tng: req.body.place.tng 
        }
    });
    // save event to mongodb
    newEvent.save()
        .then(event => {
            res.json({
                id: event._id,
                name: event.name,
                goal: event.goal,
                place: {
                    lat: event.place.lat,
                    tng: event.place.tng
                }
            })
        })
        .catch(error => res.status(500).json({ error }));

});

// get event
event.get('/:id', (req, res) => {
    Event.findOne({ _id: req.params.id })
        .then(event => {
            let followersCount = event.users_id.length;
            res.json({
                id: event._id,
                name: event.name,
                goal: event.goal,
                place: {
                    lat: event.place.lat,
                    tng: event.place.tng
                },
                followers: followersCount
            });
        })
        .catch(error => res.status(500).json({ error }));
});

event.get('/all', (req, res) => {
    Event.find({})
        .then(events => {
            events = events.map(function (event) {
                return {
                    id: event._id,
                    name: event.name,
                    place: {
                        lat: event.place.lat,
                        tng: event.place.tng
                    }
                }
            });
            res.json({ events })
        })
        .catch(error => res.status(500).json({ error }));
});

// event.patch('/:id/followers', checkToken, (req, res) => {
//     if (typeof(req.id) === 'undefined')
//         return res.status(403).json({ erorr: 'Forbidden'});
//     let url = req.originalUrl.split('/');
//     const id = url[3];
//     console.log(id);
// })


module.exports = event;
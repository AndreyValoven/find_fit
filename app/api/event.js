const event = require('express').Router();
const mongoose = require('mongoose');
const Ajv = require('ajv');

const checkToken = require('./../validateToken');
const Event = require('./../schemas/event');
const User = require('./../schemas/user');

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
            lng: { type: 'number' }
        },
        date: { type: 'string' }
    }
}

const eventValidate = ajv.compile(eventType);

// create event
event.post('/create',/* checkToken,*/ (req, res) => {
    // if (typeof(req.id) === 'undefined')
    //     return res.status(403).json({ erorr: 'Forbidden'});
    if (!eventValidate(req.body)) 
        return res.status(500).json({ error: eventValidate.errors})
    date = Date.UTC(...req.body.date.replace(/-/g, '/').replace(/:/g, '/').replace(/T/, '/').split('/'));
    let newEvent = new Event({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        user_id: "5b0069ada5aa6c4d44f70a02",
        goal: req.body.goal,
        sport_type: req.body.sport_type,
        place: {
            lat: req.body.place.lat,
            lng: req.body.place.lng 
        },
        date
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
                    lng: event.place.lng
                },
                date: event.date
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
                    lng: event.place.lng
                },
                followersCount,
            });
        })
        .catch(error => res.status(500).json({ error }));
});


// subscribe to event
event.patch('/:id/followers', checkToken, (req, res) => {
    if (typeof(req.id) === 'undefined')
        return res.status(403).json({ erorr: 'Forbidden'});
    let url = req.originalUrl.split('/');
    const id = url[3];
    Event.findOne({ _id: id })
        .then(event => {
            if (event === null) return res.status(404).json({ error: 'Not found' });
            if (event.user_id === req.id) 
                return  res.status(500).json({ error: 'user who create can not submint this event'});
            for(let user of event.users_id) {
                if (user + '' === req.id + '')
                    return res.status(500).json({error: 'you follow this event'});
            }
            event.users_id.push(req.id);
            return event.save()
        })
        .then(event => User.findOne({  _id: req.id }))
        .then(user => {
            for (let event of user.following_events) {
                if (event.id + '' === id) 
                    return res.status(500).json({ error: 'you follow this event'})
            }
            user.following_events.push(id);
            return user.save();
        })
        .then(() => {
            return Event.findOne({ _id: id })
        })
        .then( event => {
            let followersCount = event.users_id.length;
            User.find({ _id: {$in: event.users_id }}).limit(3)
                .then(users => {
                    users = users.map(function(user) {
                        return {
                            id: user._id,
                            name: user.name
                        }
                    });
                    res.json({
                        users,
                        followersCount
                    })
                });
        })
        .catch(error => res.status(500).json({ error }));
});

// get event followers
event.get('/:id/followers', (req, res) => {
    let url = req.originalUrl.split('/');
    const id = url[3];
    Event.findOne({ _id: id })
        .then(event => {
            return User.find({
                _id: {
                    $in: event.users_id
                }
            })
        })
        .then(users => {
            users = users.map(function (user) {
                return {
                    id: user._id,
                    name: user.name
                }
            });
            res.json([ ...users ]);
        })
        .catch(error => res.status(500).json({ error }));
});


module.exports = event;
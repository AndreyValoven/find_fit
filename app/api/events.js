const events = require('express').Router();
const Event = require('./../schemas/event');

events.get('/all', (req, res) => {
    Event.find({})
        .then(events => {
            events = events.map(function (event) {
                return {
                    id: event._id,
                    name: event.name,
                    place: {
                        lat: event.place.lat,
                        lng: event.place.lng
                    }
                }
            });
            res.json([ ...events ]);
        })
        .catch(error => res.status(500).json({ error }));
});

// nned to test
events.get('/filter', (req, res) => {
    const query = Object.assign({}, req.query);
    Event.find({
        sport_type:  { $in: query.sport_type }
    })
        .then(events => {
            events = events.map(function(event) {
                return {
                    id: event._id,
                    name: event.name,
                    place: {
                        lat: event.place.lat,
                        lng: event.place.lng
                    }
                }
            });
            res.json([ ...events ]);
        })
        .catch(error => res.status(500).json({ error }));
});

module.exports = events;
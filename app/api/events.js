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
                        tng: event.place.tng
                    }
                }
            });
            res.json([ ...events ]);
        })
        .catch(error => res.status(500).json({ error }));
});

module.exports = events;
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
    let startDate = Date.UTC(...query.start_date.split('/'));
    let endDate = Date.UTC(...query.end_date.split('/'));
    Event.find({
        sport_type:  { $in: query.sport_type }
    })
        .then(events => {
            let eventsFormate = [];
            events.map(function(event) {
                if (event.date <= endDate && event.date >= startDate)
                    eventsFormate.push({
                        id: event._id,
                        name: event.name,
                        place: {
                            lat: event.place.lat,
                            lng: event.place.lng
                        }
                    });
            });
            res.json([ ...eventsFormate ]);
        })
        .catch(error => res.status(500).json({ error }));
});

module.exports = events;
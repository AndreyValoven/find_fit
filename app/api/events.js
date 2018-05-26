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

// events filter
events.get('/filter', (req, res) => {
    const query = Object.assign({}, req.query);
    let start = query.start_date.replace(/-/g, '/');
    start = start.replace(/:/g, '/');
    start = start.replace(/T/, '/');
    start = start.split('/');
    let startDate = Date.UTC(...start);
    let end = query.end_date.replace(/-/g, '/');
    end = end.replace(/:/g, '/');
    end = end.replace(/T/, '/');
    end = end.split('/');
    let endDate = Date.UTC(...end);
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
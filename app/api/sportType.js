const sportType = require('express').Router();

const SportType = require('./../schemas/sportType');

sportType.get('/', (req, res) => {
    SportType.find({})
        .then(types => {
            types = types.map(function (type) {
                return {
                    name: type.name
                };
            });
            res.json([ ...types ]);
        })
        .catch(error => res.status(500).json({ error }));
});

module.exports = sportType;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let user = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, unique: true },
    sport_type: [ String ],
    contacts: {
        number: Number,
        link: String
    },
    info: {
        sex: String,
        age: Number,
        goal: String
    },
    following_events: [
        {
            type: mongoose.Schema.Types.ObjectId
        }
    ]
});

module.exports = mongoose.model('User', user);
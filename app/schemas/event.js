const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let event = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: mongoose.Schema.Types.ObjectId,
    name: String,
    goal: String,
    sport_type: [ {type: String} ],
    place: 
        {
            lat: Number,
            lng: Number
        },
    type: String,
    users_id: [
        {
            type: mongoose.Schema.Types.ObjectId
        }
    ],
    date: Number
});

module.exports = mongoose.model('Event', event);
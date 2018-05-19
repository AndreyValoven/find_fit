const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let event = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: mongoose.Schema.Types.ObjectId,
    name: String,
    goal: String,
    place: [
        {
            lat: Number,
            tng: Number
        }
    ],
    type: String,
    users_id: [
        {
            type: mongoose.Schema.Types.ObjectId
        }
    ]
});
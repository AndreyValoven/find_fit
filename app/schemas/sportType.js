const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let sportType = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String
});

module.exports = mongoose.model('SportType', sportType);
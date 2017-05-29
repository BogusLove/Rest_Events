var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    place: {type: Schema.Types.ObjectId, ref : 'Object'},
    date: {type: Date, required: true},
    name: {type: String, required: true},
    type: {type: String, required: true},
    idOfPeople: {type: [], required: false},
    countOfPeople: {type: Number, required: true},
    imagePath: {type: String, required: true},
    status: {type: String, required: true}
});

module.exports = mongoose.model('Event', schema);
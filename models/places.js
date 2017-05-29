var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    name: {type: String, required: true},
    type: {type: String, required: true},
    address: {type: String, required: true},
    countOfPlaces: {type: Number, required: true},
    idOfDirector : {type: Schema.Types.ObjectId, ref : 'Director'},
    date: {type: Date, required: true},
    duration: {type: [], required: true}
});

module.exports = mongoose.model('Places', schema);
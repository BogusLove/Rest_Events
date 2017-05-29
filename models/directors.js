var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    type: {type: String, required: true},
    leaderName: {type: String, required: true},
    name: {type: String, required: true},
    phone: {type: String, required: true}
});

module.exports = mongoose.model('Directors', schema);
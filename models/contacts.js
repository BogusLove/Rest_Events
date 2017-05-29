var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    address: {type: String, required: true},
    phones: {type: [], required: true}
});

module.exports = mongoose.model('Contacts', schema);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    login: {type: String, required: true},
    password: {type: String, required: true},
    type: {type: String, required: true}
});

module.exports = mongoose.model('Users_Admins', schema);
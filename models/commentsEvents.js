var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    event: {type: Schema.Types.ObjectId, ref: 'Event'},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    text: {type: String, required: true}
});

module.exports = mongoose.model('CommentsEvents', schema);
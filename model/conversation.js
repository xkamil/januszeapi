var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConversationSchema = new Schema({
    users: [Schema.Types.ObjectId],
    created: {type: Date, default: Date.now}
});

var Conversation = mongoose.model('Conversation', ConversationSchema);

module.exports = Conversation;
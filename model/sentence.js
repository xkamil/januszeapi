var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SentenceSchema = new Schema({
    conversation_id: Schema.Types.ObjectId,
    user_id: Schema.Types.ObjectId,
    sentence: String,
    created: {type: Date, default: Date.now}
});

var Sentence = mongoose.model('Sentence', SentenceSchema);

module.exports = Sentence;
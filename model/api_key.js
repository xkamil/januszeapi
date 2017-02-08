var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ApiKeySchema = new Schema({
    key: String,
    user_id: Schema.ObjectId,
    created_at: {type: Date, default: Date.now}
});

var ApiKey = mongoose.model('ApiKey', ApiKeySchema);

module.exports = ApiKey;
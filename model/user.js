var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    login: String,
    password: String,
    age: Number,
    created: {type: Date, default: Date.now}
});

var User = mongoose.model('User', UserSchema);

User.isValid = function (user) {
    if (!user.login || user.login.trim().length < 3) {
        return false;
    } else if (!user.password || user.password.trim().length < 3) {
        return false;
    }
    return true;
};

module.exports = User;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    login: String,
    password: String,
    age: Number,
    created: {type: Date, default: Date.now}
});

var User = mongoose.model('User', UserSchema);

User.prototype.validate = function () {
    if (!this.login || this.login.trim().length < 3) {
        return false;
    } else if (!this.password || this.password.trim().length < 3) {
        return false;
    }
    return true;
};

module.exports = User;
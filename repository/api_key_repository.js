var ApiKey = require('../model/api_key');
var HttpCode = require('../http_codes');
var mongoose = require('mongoose');
var SHA256 = require("crypto-js/sha256");

var ApiKeyRepository = {};

ApiKeyRepository.getApiKey = function (key, callback) {

    ApiKey.findOne({"key": key}, function (err, apikey) {
        if (err) {
            callback(HttpCode.HTTP_INTERNAL_ERROR, null);
        } else if (apikey) {
            callback(null, apikey);
        } else {
            callback(HttpCode.HTTP_NOT_FOUND, null);
        }
    })
};


ApiKeyRepository.addApiKey = function (user_id, callback) {
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
        callback(HttpCode.HTTP_BAD_REQUEST, null);
    } else {
        var apikey = new ApiKey();
        apikey.user_id = user_id;
        apikey.key = SHA256(user_id + Math.random());
        apikey.save();

        callback(null, {key: apikey.key});
    }
};

module.exports = ApiKeyRepository;
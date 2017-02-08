var User = require('../model/user');
var HttpCode = require('../http_code');
var mongoose = require('mongoose');
var SHA256 = require("crypto-js/sha256");

var UsersRepository = {};

UsersRepository.getUser = function (id, callback) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        callback(HttpCode.HTTP_NOT_FOUND, null);
    } else {
        User.findById(id, function (err, user) {
            if (err) {
                callback(HttpCode.HTTP_INTERNAL_ERROR, null);
            } else if (user) {
                callback(null, user);
            } else {
                callback(HttpCode.HTTP_NOT_FOUND, null);
            }
        })
    }
};

UsersRepository.getUsers = function (callback) {

    User.find(function (err, users) {
        if (err) {
            callback(HttpCode.HTTP_INTERNAL_ERROR, null);
        } else if (users) {
            callback(null, users);
        } else {
            callback(HttpCode.HTTP_NOT_FOUND, null);
        }
    })
};

UsersRepository.addUser = function (user, callback) {
    if (!(user instanceof User) || !user.validate()) {
        callback(HttpCode.HTTP_BAD_REQUEST, null);
    } else {
        User.findOne({login: user.login}, function (err, foundUser) {
            if (err) {
                callback(HttpCode.HTTP_INTERNAL_ERROR, null);
            } else if (foundUser) {
                callback(HttpCode.HTTP_CONFLICT, null);
            } else {
                user.password = SHA256(user.password);
                user.save();
                callback(null, user);
            }
        })
    }
};

module.exports = UsersRepository;
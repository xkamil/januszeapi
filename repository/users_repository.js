var User = require('../model/user');
var Exceptions = require('../exceptions');
var mongoose = require('mongoose');
var SHA256 = require("crypto-js/sha256");

var UsersRepository = {};

UsersRepository.getUser = function (id, callback) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        callback(Exceptions.HTTP_NOT_FOUND, null);
    } else {
        User.findById(id, function (err, user) {
            if (err) {
                callback(Exceptions.HTTP_INTERNAL_ERROR, null);
            } else if (user) {
                callback(null, user);
            } else {
                callback(Exceptions.HTTP_NOT_FOUND, null);
            }
        })
    }
};

UsersRepository.getUsers = function (callback) {

    User.find(function (err, users) {
        if (err) {
            callback(Exceptions.HTTP_INTERNAL_ERROR, null);
        } else if (users) {
            callback(null, users);
        } else {
            callback(Exceptions.HTTP_NOT_FOUND, null);
        }
    })
};

UsersRepository.addUser = function (user, callback) {
    if (!(user instanceof User) || !user.validate()) {
        callback(Exceptions.HTTP_BAD_REQUEST, null);
    } else {
        User.findOne({login: user.login}, function (err, foundUser) {
            if (err) {
                callback(Exceptions.HTTP_INTERNAL_ERROR, null);
            } else if (foundUser) {
                callback(Exceptions.HTTP_CONFLICT, null);
            } else {
                user.password = SHA256(user.password);
                user.save();
                callback(null, user);
            }
        })
    }
};

module.exports = UsersRepository;
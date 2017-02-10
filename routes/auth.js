var express = require('express');
var SHA256 = require("crypto-js/sha256");
var UsersRepository = require('../repository/users_repository');
var HttpCode = require('../http_codes');
var User = require('../model/user');
var ApiKeyRepository = require('../repository/api_key_repository');
var router = express.Router();

router.post('/register', function (req, res) {
    var user = new User();
    user.login = req.body.login;
    user.password = req.body.password;

    if (!user.isValid()) {
        res.status(HttpCode.HTTP_BAD_REQUEST).json();
        return;
    }

    UsersRepository.getUser({login: user.login}, function (err, usr) {
        if (err && err != HttpCode.HTTP_NOT_FOUND) {
            res.status(HttpCode.HTTP_INTERNAL_ERROR).json(err);
        } else if (usr) {
            res.status(HttpCode.HTTP_CONFLICT).json();
        } else {
            user.password = SHA256(user.password);
            user.save();
            ApiKeyRepository.addApiKey(user._id, function (err, key) {
                if (err) {
                    res.status(HttpCode.HTTP_INTERNAL_ERROR)
                } else if (key) {
                    res.status(HttpCode.HTTP_OK).json(key);
                } else {
                    res.status(HttpCode.HTTP_INTERNAL_ERROR)
                }
            });
        }
    });

});

router.post('/login', function (req, res) {
    var user = new User();
    user.login = req.body.login;
    user.password = SHA256(req.body.password);

    if (!req.body.login || !req.body.password) {
        console.log(req.body.login);
        console.log(req.body.password);
        res.status(HttpCode.HTTP_NOT_FOUND).json();
        return;
    }

    UsersRepository.getUser(user, function (err, usr) {
        if (err) {
            res.status(err).json();
        } else if (usr) {
            ApiKeyRepository.addApiKey(usr._id, function (err, key) {
                if (err) {
                    res.status(HttpCode.HTTP_INTERNAL_ERROR)
                } else if (key) {
                    res.status(HttpCode.HTTP_OK).json(key);
                } else {
                    res.status(HttpCode.HTTP_INTERNAL_ERROR)
                }
            })
        } else {
            res.status(HttpCode.HTTP_NOT_FOUND).json();
        }
    });

});

module.exports = router;
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

    if (!User.isValid(user)) {
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
    if (!req.body.login || !req.body.password) {
        res.status(HttpCode.HTTP_NOT_FOUND).json();
        return;
    }

    var user = {
        login: req.body.login,
        password: SHA256(req.body.password).toString()
    };

    UsersRepository.getUser(user, function (err, usr) {
        if (err) {
            console.log(err);
            res.status(err).json();
        } else if (usr) {
            console.log('ccc');
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
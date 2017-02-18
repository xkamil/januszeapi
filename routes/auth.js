var express = require('express');
var SHA256 = require("crypto-js/sha256");
var HttpCode = require('../http_codes');
var User = require('../model/user');
var router = express.Router();
var ApiKey = require('../model/api_key');

router.post('/register', function (req, res) {
    var user = new User();
    user.login = req.body.login;
    user.password = req.body.password;

    if (!User.isValid(user)) {
        res.status(HttpCode.HTTP_BAD_REQUEST).json();
        return;
    }

    User.findOne({login: user.login}, function (err, usr) {
        if (err) {
            res.status(HttpCode.HTTP_INTERNAL_ERROR).json(err);
        } else if (usr) {
            res.status(HttpCode.HTTP_CONFLICT).json();
        } else {
            user.password = SHA256(user.password).toString();
            user.save(function (err) {
                if (err) {
                    res.status(HttpCode.HTTP_INTERNAL_ERROR).json();
                } else {
                    var apikey = new ApiKey();
                    apikey.user_id = user._id;
                    apikey.key = SHA256(user._id + Math.random()).toString();
                    apikey.save();

                    res.status(HttpCode.HTTP_OK).json({key: apikey.key, id: user._id});
                }
            });
        }
    });
});

router.post('/login', function (req, res) {
    var login = req.body.login || '';
    var password = SHA256(req.body.password).toString() || '';

    User.findOne({"login": login, "password": password}, function (err, user) {
        if (err) {
            res.status(HttpCode.HTTP_INTERNAL_ERROR).json();
        } else if (user) {
            var apikey = new ApiKey();
            apikey.user_id = user._id;
            apikey.key = SHA256(user._id + Math.random());
            apikey.save(function (err) {
                if (err) {
                    res.status(HttpCode.HTTP_INTERNAL_ERROR).json();
                } else {
                    res.status(HttpCode.HTTP_OK).json({key: apikey.key});
                }
            });
        } else {
            res.status(HttpCode.HTTP_NOT_FOUND).json();
        }
    });
});

module.exports = router;
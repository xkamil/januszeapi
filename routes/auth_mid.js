var express = require('express');
var HttpCode = require('../http_codes');
var router = express.Router();
var ApiKey = require('../model/api_key');

router.use('/', function (req, res, next) {
    var apiKey = req.header('key')|| '';
    if(req.url === '/login' || req.url === '/register'){
        next();
    }else{
        ApiKey.findOne({key: apiKey}, function (err, key) {
            if (err) {
                res.status(HttpCode.HTTP_INTERNAL_ERROR).json();
            } else if (key) {
                //TODO add expired token validation
                req.locals = {};
                req.locals.user_id = key.user_id || 'some id';
                next();
            } else {
                res.status(HttpCode.HTTP_UNAUTHORIZED).json();
            }
        });
    }
});

module.exports = router;
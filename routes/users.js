var express = require('express');
var HttpCode = require('../http_codes');
var router = express.Router();

router.get('/test', function (req, res) {

    res.status(HttpCode.HTTP_OK).json({aaa: 'aaa', message: 'vilcomen!', user_id: req.locals.user_id});
});

module.exports = router;
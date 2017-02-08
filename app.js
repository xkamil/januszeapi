var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://janusz:mietek@ds145009.mlab.com:45009/users');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var usersRouter = require('./routes/users');

app.use('/api', usersRouter);

app.listen(port);

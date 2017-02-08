var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var env = process.argv[2]


if(env === 'prod'){
    console.log('Running on production env');
    mongoose.connect('mongodb://janusz:mietek@ds145009.mlab.com:45009/users');
}else if(env === 'test'){
    console.log('Running on test env');
    mongoose.connect('mongodb://localhost:27017/test');
}

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var authRouter = require('./routes/auth');
var usersRouter = require('./routes/users');

app.use('/api', usersRouter);
app.use('/api', authRouter);

app.listen(port);

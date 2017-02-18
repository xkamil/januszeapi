var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var env = process.argv[2];
var config = require('./config.json');

mongoose.connect(config[env].db);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


var authRouter = require('./routes/auth');
var authMidRouter = require('./routes/auth_mid');
var usersRouter = require('./routes/users');
var conversationRouter = require('./routes/conversation');

app.use('/api', authMidRouter);
app.use('/api', conversationRouter);
app.use('/api', usersRouter);
app.use('/api', authRouter);

app.listen(process.env.PORT || config[env].app.port);

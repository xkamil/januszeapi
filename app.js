var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var UsersRepository = require('./repository/users_repository');
var User = require('./model/user');

mongoose.connect('mongodb://janusz:mietek@ds145009.mlab.com:45009/users');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port
var router = express.Router();              // get an instance of the express Router

router.get('/test', function (req, res) {
    res.status(200).json({message: "APP WORKS!"});
});


router.get('/user/:id', function (req, res) {
    var id = req.params.id;

    UsersRepository.getUser(id, function (err, user) {
        if(err){
            res.status(err).json();
        }else{
            res.status(200).json(user);
        }
    });
});

router.get('/users', function (req, res) {

    UsersRepository.getUsers(function (err, users) {
        if(err){
            res.status(err).json();
        }else{
            res.status(200).json(users);
        }
    });
});

router.post('/users', function (req, res) {
    var user = new User();
    user.login = req.body.login;
    user.password = req.body.password;

    UsersRepository.addUser(user, function (err, user) {
        if(err){
            res.status(err).json();
        }else{
            res.status(200).json(user);
        }
    });
});

app.use('/api', router);

app.listen(port);

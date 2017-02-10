var express = require('express');
var UsersRepository = require('../repository/users_repository');
var HttpCode = require('../http_codes');
var User = require('../model/user');
var router = express.Router();

router.get('/users/:id', function (req, res) {
    var id = req.params.id;

    UsersRepository.getUserById(id, function (err, user) {
        if(err){
            res.status(err).json();
        }else{
            res.status(HttpCode.HTTP_OK).json(user);
        }
    }); 
});

router.get('/users', function (req, res) {

    UsersRepository.getUsers(function (err, users) {
        if(err){
            res.status(err).json();
        }else{
            res.status(HttpCode.HTTP_OK).json(users);
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
            res.status(HttpCode.HTTP_CREATED).json(user);
        }
    });
});

module.exports = router;
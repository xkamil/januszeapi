var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var UsersRepository = require('./repository/users_repository');
var User = require('./model/user');

mongoose.connect('mongodb://janusz:mietek@ds145009.mlab.com:45009/users');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8083;        // set our port
var router = express.Router();              // get an instance of the express Router


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



// router.get('/login', function (req, res) {
//     var login = req.query.login;
//     var password = req.query.password;
//
//     User.findOne({"login": login, "password": SHA256(password).toString()},'_id',function (err, usr) {
//         if(err){
//             res.status(403).json();
//         }
//         console.log(Date.now());
//         console.log(SHA256(Date.now()).toString());
//         if(usr){
//             console.log('dupa');
//             var apikey = new ApiKey();
//             apikey.user_id = usr._id;
//             apikey.key = SHA256(Date.now()).toString();
//             apikey.save();
//            
//             res.status(200).json({
//                 key: apikey.key
//             });
//         }else{
//             res.status(403).json();
//         }
//     });
// });
//
//
// router.get('/', function (req, res) {
//     var key = req.header('apikey');
//     console.log('ApiKey:' + key);
//
//     var userId = getUserIdByApiKey(key);
//
//     if(userId){
//         res.status(200).json();
//     }
//     res.status(403).json();
// });

app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);
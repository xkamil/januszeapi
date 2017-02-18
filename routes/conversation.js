var express = require('express');
var HttpCode = require('../http_codes');
var User = require('../model/user');
var router = express.Router();
var Conversation = require('../model/conversation');
var Logger = require('./../logger');
var TAG = 'routes/conversation.js';
var mongoose = require('mongoose');
var Sentence = require('../model/sentence');

router.get('/conversations', function (req, res) {

    var user_id = req.locals.user_id || '';

    Conversation.find({users: user_id}, function (err, conversations) {
        if (err) {
            res.status(HttpCode.HTTP_INTERNAL_ERROR).json();
        } else if (conversations) {
            res.status(HttpCode.HTTP_OK).json(conversations);
        } else {
            res.status(HttpCode.HTTP_NOT_FOUND).json();
        }
    });
});

router.post('/conversations/withUsers', function (req, res) {
    var user_id = req.locals.user_id || '';
    var users = req.body || [];

    if (!users.length || users.length == 0 || users.indexOf(user_id) > 0) {
        res.status(HttpCode.HTTP_INTERNAL_ERROR).json({message: 'invalid users ids supplied'});
        return;
    }

    users.push(user_id);

    Conversation.findOne({"users": {$all: users, $size: users.length}}, function (err, conversations) {
        if (err) {
            res.status(HttpCode.HTTP_INTERNAL_ERROR).json();
        } else if (conversations) {
            res.status(HttpCode.HTTP_OK).json(conversations);
        } else {
            res.status(HttpCode.HTTP_NOT_FOUND).json();
        }
    })
});

router.post('/conversations', function (req, res) {
    var user_id = req.locals.user_id || '';
    var users = req.body || [];
    var usersArray = [];
    usersArray.push(user_id);

    if (!users.length || users.length == 0) {
        console.log('CHECK 1');
        res.status(HttpCode.HTTP_BAD_REQUEST).json({message: "There must be 1 or more users ids in request body"});
        return;
    }

    for (var i = 0; i < users.length; i++) {
        if (!mongoose.Types.ObjectId.isValid(users[i])) {
            console.log('CHECK 2');
            res.status(HttpCode.HTTP_BAD_REQUEST).json({message: 'User id is not valid! User id:' + users[i]});
            return;
        }
        usersArray.push(users[i]);
    }

    Conversation.findOne({"users": {$all: usersArray, $size: usersArray.length}}, function (err, conversations) {
        if (err) {
            res.status(HttpCode.HTTP_INTERNAL_ERROR).json();
        } else if (conversations) {

            Logger.log(TAG, conversations);
            res.status(HttpCode.HTTP_CONFLICT).json();
        } else {
            var newConversation = new Conversation();
            newConversation.users = usersArray;
            newConversation.save();
            res.status(HttpCode.HTTP_CREATED).json({_id: newConversation._id});
        }
    })
});

router.get('/conversations/:id/sentences', function (req, res) {
    var pConversation_id = req.params.id;
    var user_id = req.locals.user_id || '';

    Conversation.findOne({_id: pConversation_id}, function (err, conversation) {
        if(err){
            res.status(HttpCode.HTTP_INTERNAL_ERROR).json();
        }else if(conversation){
            console.log('CONVERSATION: ');
            console.log(conversation);
            console.log('USER_ID: ');
            console.log(user_id);
            console.log(!conversation.users);
            console.log(conversation.users.indexOf(user_id));
            if(!conversation.users || conversation.users.indexOf(user_id) == -1){
                res.status(HttpCode.HTTP_UNAUTHORIZED).json();
            }else{
                Sentence.find({conversation_id: pConversation_id}, function (err, conversations) {
                    if(err){
                        res.status(HttpCode.HTTP_INTERNAL_ERROR).json();
                    }else{
                        console.log('Conversation found. Returning: ');
                        console.log(conversations + '\n\n');
                        res.status(HttpCode.HTTP_OK).json(conversations);
                    }
                });
            }
        }else{
            res.status(HttpCode.HTTP_NOT_FOUND).json();
        }
    });
});

router.post('/conversations/:id/sentences', function (req, res) {
    var pConversation_id = req.params.id;
    var pSentence = req.body.sentence;
    var user_id = req.locals.user_id || '';

    if(!pSentence || pSentence.trim().length == 0){
        res.status(HttpCode.HTTP_BAD_REQUEST).json({message: 'no sentence sent'});
        return;
    }

    var sentence = new Sentence();
    sentence.sentence = pSentence;
    sentence.conversation_id = pConversation_id;
    sentence.user_id = user_id;

    sentence.save(function (err) {
        if(err){
            res.status(HttpCode.HTTP_INTERNAL_ERROR).json({message: 'error when saving sentence', error: err});
        }else{
            res.status(HttpCode.HTTP_CREATED).json();
        }
    });

});

module.exports = router;
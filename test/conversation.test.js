var faker = require('Faker');
var expect = require('chai').expect;
var chai = require('chai');
var chaiHttp = require('chai-http');
var config = require('../config.json');
chai.use(chaiHttp);
var env = 'test';

var baseUrl = config[env].app.host + ":" + config[env].app.port;

describe('Conversation ', function () {

    describe('POST /conversations', function () {
        var users_ids = [];
        var users_keys = [];

        beforeEach(function (done) {
            users_ids = [];
            users_keys = [];
            var requestNum = 0;

            for (var i = 0; i < 10; i++) {
                var login = faker.Name.firstName() + Math.random();
                chai.request(baseUrl)
                    .post('/api/register')
                    .set('Content-Type', 'application/x-www-form-urlencoded')
                    .send({login: login, password: login})
                    .end(function (err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.include.keys('key');
                        expect(res.body).to.include.keys('id');
                        users_ids.push(res.body.id);
                        users_keys.push(res.body.key);
                        requestNum++;
                        if(requestNum == 4){
                            done();
                        }
                    });
            }

        });

        it('should return status 400 if only 1 user id is sent', function (done) {

            chai.request(baseUrl)
                .post('/api/conversations')
                .set('key', users_keys[0])
                .end(function (err, res) {
                    expect(res).to.have.status(400);
                    done();
                });
        });

        it('should return status 201', function (done) {

            chai.request(baseUrl)
                .post('/api/conversations')
                .set('key', users_keys[0])
                .set('Content-Type', 'application/json')
                .send([ users_ids[1]])
                .end(function (err, res) {
                    expect(res).to.have.status(201);
                    done();
                });
        });

        it('should return status 409 when creating conversation with users that alredy exists', function (done) {

            chai.request(baseUrl)
                .post('/api/conversations')
                .set('key', users_keys[0])
                .set('Content-Type', 'application/json')
                .send([ users_ids[1], users_ids[2]])
                .end(function (err, res) {
                    expect(res).to.have.status(201);

                    chai.request(baseUrl)
                        .post('/api/conversations')
                        .set('key', users_keys[0])
                        .set('Content-Type', 'application/json')
                        .send([ users_ids[1], users_ids[2]])
                        .end(function (err, res) {
                            expect(res).to.have.status(409);

                            chai.request(baseUrl)
                                .post('/api/conversations')
                                .set('key', users_keys[0])
                                .set('Content-Type', 'application/json')
                                .send([users_ids[2] ,users_ids[1]])
                                .end(function (err, res) {
                                    expect(res).to.have.status(409);
                                    done();
                                });
                        });
                });
        });

        it('should return status 400 if one or more users ids are invalid', function (done) {

            chai.request(baseUrl)
                .post('/api/conversations')
                .set('key', users_keys[0])
                .set('Content-Type', 'application/json')
                .send([ users_ids[1], 'asdf'])
                .end(function (err, res) {
                    expect(res).to.have.status(400);
                    done();
                });
        });
    });

    describe('GET /conversations', function () {
        var users_ids = [];
        var users_keys = [];

        beforeEach(function (done) {
            users_ids = [];
            users_keys = [];
            var requestNum = 0;

            for (var i = 0; i < 10; i++) {
                var login = faker.Name.firstName() + Math.random();
                chai.request(baseUrl)
                    .post('/api/register')
                    .set('Content-Type', 'application/x-www-form-urlencoded')
                    .send({login: login, password: login})
                    .end(function (err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.include.keys('key');
                        expect(res.body).to.include.keys('id');
                        users_ids.push(res.body.id);
                        users_keys.push(res.body.key);

                        requestNum++;

                        if(requestNum == 10){
                            chai.request(baseUrl)
                                .post('/api/conversations')
                                .set('key', users_keys[0])
                                .set('Content-Type', 'application/json')
                                .send([ users_ids[1], users_ids[2]])
                                .end(function (err, res) {
                                    expect(res).to.have.status(201);

                                    chai.request(baseUrl)
                                        .post('/api/conversations')
                                        .set('key', users_keys[0])
                                        .set('Content-Type', 'application/json')
                                        .send([ users_ids[2], users_ids[3]])
                                        .end(function (err, res) {
                                            expect(res).to.have.status(201);

                                            chai.request(baseUrl)
                                                .post('/api/conversations')
                                                .set('key', users_keys[0])
                                                .set('Content-Type', 'application/json')
                                                .send([users_ids[1], users_ids[2], users_ids[3]])
                                                .end(function (err, res) {
                                                    expect(res).to.have.status(201);
                                                    done();
                                                });
                                        });
                                });
                        }
                    });
            }

        });

        it('should return status 200 and conversation with user1 and user2', function (done) {

            chai.request(baseUrl)
                .post('/api/conversations/withUsers')
                .set('key', users_keys[0])
                .set('Content-Type', 'application/json')
                .send([ users_ids[1], users_ids[2]])
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body.users).to.have.lengthOf(3);
                    expect(res.body.users).to.contain(users_ids[0]);
                    expect(res.body.users).to.contain(users_ids[1]);
                    expect(res.body.users).to.contain(users_ids[2]);
                });

            chai.request(baseUrl)
                .post('/api/conversations/withUsers')
                .set('key', users_keys[0])
                .set('Content-Type', 'application/json')
                .send([users_ids[2], users_ids[1]])
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body.users).to.have.lengthOf(3);
                    expect(res.body.users).to.contain(users_ids[0]);
                    expect(res.body.users).to.contain(users_ids[1]);
                    expect(res.body.users).to.contain(users_ids[2]);
                    done();
                });
        });

        it('should return status 404 for users that had no conversation', function (done) {

            chai.request(baseUrl)
                .post('/api/conversations/withUsers')
                .set('key', users_keys[0])
                .set('Content-Type', 'application/json')
                .send([ users_ids[1], users_ids[5]])
                .end(function (err, res) {
                    expect(res).to.have.status(404);
                    done();
                });
        });

    })

});
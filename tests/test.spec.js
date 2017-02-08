var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test');
var faker = require('Faker');
var request = require("request");
var base_url = "http://localhost:8080/api/";
var ApiKey = require('../model/api_key');
var User = require('../model/user');
process.env.NODE_ENV = 'test';

describe("Januszeapi server ", function () {

    describe("POST /register", function () {
        afterEach(function (done) {
            User.remove({}, function () {
            });
            ApiKey.remove({}, function () {
            });
            done();
        });


        it("returns status code 200", function (done) {

            request.post({
                url: base_url + 'register',
                form: {login: faker.Name.firstName(), password: faker.Name.firstName()}
            }, function (err, res, body) {
                expect(res.statusCode).toBe(200);
                done();
            });
        });

        it("returns status code 409", function (done) {

            var name = faker.Name.firstName() + 'fff';

            request.post({
                url: base_url + 'register',
                form: {login: name, password: name}
            }, function (err, res, body) {
                expect(res.statusCode).toBe(200);
                request.post({
                    url: base_url + 'register',
                    form: {login: name, password: name}
                }, function (err, res, body) {
                    expect(res.statusCode).toBe(409);
                    done();
                });

            });
        });

        it("returns status code 400", function (done) {

            var name = faker.Name.firstName() + 'fff';

            request.post({
                url: base_url + 'register',
                form: {login: 'aa', password: 'aaaa'}
            }, function (err, res, body) {
                expect(res.statusCode).toBe(400);

                request.post({
                    url: base_url + 'register',
                    form: {login: name, password: 'aa'}
                }, function (err, res, body) {
                    expect(res.statusCode).toBe(400);
                    done();
                });

            });
        });
    });

    describe("POST /login", function () {

        it("returns status code 404", function (done) {

            var name = faker.Name.firstName() + 'fff';

            request.post({
                url: base_url + 'login',
                form: {login: name, password: 'aaaa'}
            }, function (err, res, body) {
                expect(res.statusCode).toBe(404);
                done();
            });

        });

        it("returns status code 200 and api key", function (done) {

            var name = faker.Name.firstName() + 'fff';

            request.post({
                url: base_url + 'register',
                form: {login: name, password: 'aaaaa'}
            }, function (err, res, body) {
                expect(res.statusCode).toBe(200);

                request.post({
                    url: base_url + 'login',
                    form: {login: name, password: 'aaaaa'}
                }, function (err, res, body) {
                    expect(res.statusCode).toBe(200);
                    expect(res.body.length).toBeGreaterThan(20);
                    done();
                });
            });
        });
    });
});

mongoose.disconnect();
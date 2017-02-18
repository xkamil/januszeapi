var faker = require('Faker');
var expect = require('chai').expect;
var chai = require('chai');
var chaiHttp = require('chai-http');
var config = require('../config.json');
chai.use(chaiHttp);
var env = 'prod';

var baseUrl = config[env].app.host + ":" + config[env].app.port;

describe('Registration && Loggin in', function () {
    describe('POST /register', function () {
        it('should return status 200', function (done) {
            var login = faker.Name.firstName() + Math.random();

            chai.request(baseUrl)
                .post('/api/register')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({login: login, password: login})
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.include.keys('key');
                    expect(res.body).to.include.keys('id');
                    done();
                });
        });

        it('should return status 409 if login is alredy taken', function (done) {
            var login = faker.Name.firstName() + Math.random();

            chai.request(baseUrl)
                .post('/api/register')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({login: login, password: login})
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.include.keys('key');
                    expect(res.body).to.include.keys('id');

                    chai.request(baseUrl)
                        .post('/api/register')
                        .set('content-type', 'application/x-www-form-urlencoded')
                        .send({login: login, password: login})
                        .end(function (err, res) {
                            expect(res).to.have.status(409);
                            expect(res.body).not.to.include.keys('key');
                            done();
                        });
                });
        });

        it('should return status 400 if login is too short', function (done) {
            chai.request(baseUrl)
                .post('/api/register')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({login: 'sh', password: 'asdfasgasdf'})
                .end(function (err, res) {
                    expect(res).to.have.status(400);
                    expect(res.body).not.to.include.keys('key');
                    done();
                });
        });

        it('should return status 400 if password is too short', function (done) {
            var login = faker.Name.firstName() + Math.random();

            chai.request(baseUrl)
                .post('/api/register')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({login: login, password: 'fd'})
                .end(function (err, res) {
                    expect(res).to.have.status(400);
                    expect(res.body).not.to.include.keys('key');
                    done();
                });
        });

        it('should return status 400 if password or login are not included in request', function (done) {
            chai.request(baseUrl)
                .post('/api/register')
                .set('content-type', 'application/x-www-form-urlencoded')
                .end(function (err, res) {
                    expect(res).to.have.status(400);
                    expect(res.body).not.to.include.keys('key');
                    done();
                });
        });
    });


    describe('POST /login', function () {

        it('should return status 200', function (done) {
            var login = faker.Name.firstName() + Math.random();
            var password = Math.random();

            chai.request(baseUrl)
                .post('/api/register')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({login: login, password: password})
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.include.keys('key');

                    chai.request(baseUrl)
                        .post('/api/login')
                        .set('content-type', 'application/x-www-form-urlencoded')
                        .send({login: login, password: password})
                        .end(function (err, res) {
                            expect(res).to.have.status(200);
                            expect(res.body).to.include.keys('key');
                            done();
                        });
                });
        });

        it('should return status 404 if user with specified login not exists', function (done) {
            var login = faker.Name.firstName() + Math.random();
            var password = Math.random();

            chai.request(baseUrl)
                .post('/api/login')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({login: login, password: password})
                .end(function (err, res) {
                    expect(res).to.have.status(404);
                    expect(res.body).not.to.include.keys('key');
                    done();
                });
        });

        it('should return status 404 if login or passord are not included in request', function (done) {
            chai.request(baseUrl)
                .post('/api/login')
                .set('content-type', 'application/x-www-form-urlencoded')
                .end(function (err, res) {
                    expect(res).to.have.status(404);
                    expect(res.body).not.to.include.keys('key');
                    done();
                });
        });
    });

;
});
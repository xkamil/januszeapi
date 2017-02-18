var faker = require('Faker');
var expect = require('chai').expect;
var chai = require('chai');
var chaiHttp = require('chai-http');
var config = require('../config.json');
chai.use(chaiHttp);
var env = 'test';

var baseUrl = config[env].app.host + ":" + config[env].app.port;

describe('Authorization ', function () {

    describe('GET /test', function () {

        it('should return status 401 if no api key is sent', function (done) {

            chai.request(baseUrl)
                .post('/api/test')
                .end(function (err, res) {
                    expect(res).to.have.status(401);
                    done();
                });
        });

        it('should return status 401 if invalid api key is sent', function (done) {

            chai.request(baseUrl)
                .post('/api/test')
                .set('key', 'asdfasdfdasfasdfasdfdasf')
                .end(function (err, res) {
                    expect(res).to.have.status(401);
                    done();
                });
        });

        it('should return status 200 if valid api key is sent', function (done) {
            var login = faker.Name.firstName() + Math.random();

            chai.request(baseUrl)
                .post('/api/register')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send({login: login, password: login})
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.include.keys('key');

                    chai.request(baseUrl)
                        .get('/api/test')
                        .set('key', res.body.key)
                        .end(function (err, res) {
                            expect(res).to.have.status(200);
                            done();
                        });
                });
        });

    });
});
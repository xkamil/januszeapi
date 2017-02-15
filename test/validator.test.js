var faker = require('faker');
var expect = require('chai').expect;
var chai = require('chai');
var chaiHttp = require('chai-http');
var validator = require('../utils/validator');


describe('Validator ', function () {
    describe('validateEmail', function () {
        it('should return true for valid email', function () {
            for (var i = 0; i < 1000; i++) {
                var email = faker.internet.email();
                expect(validator.validateEmail(email)).to.equal(true);
            }
        });


        it('should return false for invalid email', function () {
            for (var i = 0; i < 1000; i++) {
                var email = faker.internet.password();
                expect(validator.validateEmail(email)).to.equal(false);
            }
        });

    });

});
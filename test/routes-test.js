var assert = require('assert')
var supertest = require('supertest')
var should = require('should')
var server = supertest.agent('http://localhost:3000')

describe('sample unit test', function () {
    it('should return values', function (done) {
        server
            .get('/word/value')
            .expect('Content-type', /json/)
            .expect(201)
            .end(function (err, res) {
                
                done()
            })
    })
})

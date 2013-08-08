var expect = require('expect.js')

var X = require('../src/X.core').X


describe('X is initialize', function () {
    it('X should be object', function () {
        expect(X).to.be.an('function')
    })
    
    it('version should exist', function () {
        expect(X.version).to.be.ok()
    })
})
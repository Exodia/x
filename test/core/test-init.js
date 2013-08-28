/*var src = process.env['JSCOV'] ? '../src-cov' : '../src'

var expect = require('expect.js')
var X = require(src + '/X.core')*/


describe('X is initialize', function () {
    it('X is a function', function () {
        expect(X).to.be.an('function')
    })
    it('version is exist', function () {
        expect(X.version).to.be.ok()
    })

    it('X.define is a function', function () {
        expect(X.define).to.be.an('function')
    })

    it('global define is equal X.define', function () {
        expect(define).to.equal(X.define)
    })
})

describe('X.bind Test', function () {
//    var hasOwnProperty = X.bind(Function.call, Object.prototype.hasOwnProperty)
//    alert(hasOwnProperty)
//    alert(hasOwnProperty({a:1}, 'a'))
})
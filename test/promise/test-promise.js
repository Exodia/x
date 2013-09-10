var X = require('../../build/x')
var promisesAplusTests = require("promises-aplus-tests")

var adapter = {
    fulfilled: function (v) {
        var promise = X.Promise()

        promise.resolve(v)

        return promise
    },
    rejected: function (v) {
        var promise = X.Promise()

        promise.reject(v)

        return promise
    },

    pending: function () {
        var promise = X.Promise()
        return {
            promise: promise,
            fulfill: function (v) {
                try {
                    promise.resolve(v)
                } catch (e) {

                }
            },
            reject: function (v) {
                try {
                    promise.reject(v)
                } catch (e) {


                }
            }
        }
    }
}

promisesAplusTests(adapter, function (err) {
    console.log(err)
})

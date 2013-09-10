/**
 * @file An implement of Promise/A+
 * @see http://promises-aplus.github.io/promises-spec/
 * @author exodia(d_xinxin@163.com)
 * Date: 13-9-9
 * Time: 上午11:01
 */

X.define('X.Promise', ['X.Core', 'X.Class', 'X.Enumerable'], function (X, Class) {
    var PENDING = 'pending',
        FULFILLED = 'fulfilled',
        REJECTED = 'rejected'


    var connect = function (promise1, promise2) {
        promise1.then(
            function (val) {
                promise2.resolve(val)
            },

            function (val) {
                promise2.reject(val)
            }
        )
    }

    /**
     * @class X.Promise
     */
    X.Promise = Class({
        constructor: function () {
            if (!(this instanceof X.Promise)) {
                return new X.Promise()
            }

            this.$super(arguments)

            this._status = PENDING
            this._value = undefined
            this._fulfilledArray = []
            this._rejectedArray = []
        },


        /**
         * The status of the current promise,
         * the value is one of the "pending", "fulfilled", "rejected"
         * @property {String} _status
         * @private
         * @member X.Promise
         *
         */
        _status: null,

        _value: undefined,

        _fulfilledArray: null,

        _rejectedArray: null,

        _asyncExec: function () {
            var promise = this
            if (promise._status === PENDING) {
                return
            }


            var phs = null
            if (promise._status === FULFILLED) {
                //spec 3.2.2.3
                promise._rejectedArray = []
                phs = promise._fulfilledArray
            } else {
                //spec 3.2.3.3
                promise._fulfilledArray = []
                phs = promise._rejectedArray
            }

            setTimeout(function () {
                var ph,
                    val = promise._value

                //spec 3.2.5
                while (ph = phs.shift()) { //spec 3.2.2.2, 3.2.3.2
                    if (typeof ph.handler !== 'function') { //spec spec 3.2.1
                        //spec 3.2.6.4, 3.2.6.5
                        ph.promise[promise._status === FULFILLED ? 'resolve' : 'reject'](val)
                        continue
                    }

                    try {
                        //spec 3.2.2.1, 3.2.3.1
                        var returnVal = ph.handler(val)
                        // 这样判断是否为 promise 实例，我是不太赞同的，
                        // 但是标准测试用例会伪造一个 promise，
//                        returnVal instanceof X.Promise
                        returnVal && typeof returnVal.then === 'function'
                            ? connect(returnVal, ph.promise) //spec 3.2.6.3
                            : ph.promise.resolve(returnVal) //spec 3.2.6.1

                    } catch (e) {
                        //spec 3.2.6.2
                        ph.promise.reject(e)
                    }
                }
            }, 0)
        },

        /**
         * Adds a fulfilledHandler, rejectedHandler,
         * and progressHandler to be called for completion of a promise.
         * The fulfilledHandler is called when the promise is fulfilled.
         * The rejectedHandler is called when a promise fails.
         * The progressHandler is called for progress events.
         *
         * @method then
         * @member X.Promise
         * @param {Function} [fulfilledHandler]
         * @param {Function} [rejectedHandler]
         * @return {X.Promise}
         */
        then: function (fulfilledHandler, rejectedHandler) {
            var promise = X.Promise()

            this._fulfilledArray.push({
                promise: promise,
                handler: fulfilledHandler
            })
            this._rejectedArray.push({
                promise: promise,
                handler: rejectedHandler
            })


            this._asyncExec()
            //spec 3.2.4, 3.2.6
            return promise
        },

        /**
         * @method
         * @member X.Promise
         * @param {Function} fulfilledHandler
         * @returns {X.Promise}
         */
        done: function (fulfilledHandler) {
            return this.then(fulfilledHandler)
        },

        /**
         * @method
         * @member X.Promise
         * @param {Function} errorHandler
         * @returns {X.Promise}
         */
        fail: function (errorHandler) {
            return this.then(null, errorHandler)

        },

        always: function (handler) {
            return this.then(handler, handler)
        },

        resolve: function (val) {
            //spec 3.1
            if (this._status !== PENDING) {
                throw Error(
                    'promise is not in ' + PENDING
                        + ' so can not resolve!'
                )
            }

            //spec 3.2.2.1
            this._value = val
            this._status = FULFILLED
            this._asyncExec()

        },

        reject: function (reason) {
            //spec 3.1
            if (this._status !== PENDING) {
                throw Error(
                    'promise is not in ' + PENDING
                        + ' so can not resolve!'
                )
            }

            //spec 3.2.3.1
            this._value = reason
            this._status = REJECTED
            this._asyncExec()
        }

    })

    return X.Promise
})
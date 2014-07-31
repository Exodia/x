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


    var setImmediate = typeof setImmediate === 'function'
        ? function (fn) { setImmediate(fn); }
        : function (fn) { setTimeout(fn, 0); };

    var connect = function (promise1, promise2) {
        promise1.then(
            function (val) { promise2.resolve(val) },
            function (val) { promise2.reject(val) }
        )
    }

    var isPromise = function (obj) {
        return obj && typeof obj === 'object' && typeof obj.then === 'function'
    }

    var createHandler = function (originPromise, newPromise, callback, type) {
        return function (value) {
            try {
                if (typeof callback === 'function') {
                    // callback 为函数，处理好后未发生错误，则应该为设置下个 promise 为 resolve 状态
                    value = callback(value)
                    type = 'resolve'
                }
                // callback 不为函数，则传递给下一个 promise
                isPromise(value) ? connect(value, newPromise) : newPromise[type](value)
            } catch (e) {
                newPromise.reject(e)
            }
        }
    }

    var exec = function (promise) {
        if (promise._status === PENDING) {
            return
        }

        var callbacks = null
        if (promise._status === FULFILLED) {
            //spec 3.2.2.3
            promise._rejectedCallbacks = []
            callbacks = promise._fulfilledCallbacks
        } else {
            //spec 3.2.3.3
            promise._fulfilledCallbacks = []
            callbacks = promise._rejectedCallbacks
        }

        setImmediate(function () {
            var callback,
                val = promise._value

            //spec 3.2.5
            while (callback = callbacks.shift()) { //spec 3.2.2.2, 3.2.3.2
                callback(val)
            }
        })
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
            this._fulfilledCallbacks = []
            this._rejectedCallbacks = []
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

        _fulfilledCallbacks: null,

        _rejectedCallbacks: null,

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

            this._fulfilledCallbacks.push(createHandler(this, promise, fulfilledHandler, 'resolve'))
            this._rejectedCallbacks.push(createHandler(this, promise, rejectedHandler, 'reject'))

            exec(this)
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
            exec(this)
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
            exec(this)
        }

    })

    return X.Promise
})
/**
 * @file An implement of Promise/A
 * @author exodia(d_xinxin@163.com)
 * Date: 13-9-9
 * Time: 上午11:01
 */

X.define('X.Promise', ['X.core', 'X.Class', 'X.Enumerable'], function (X, Class) {
    var PENDING = 'pending',
        FULFILLED = 'fulfilled',
        REJECTED = 'rejected'

    /**
     * @class
     */
    X.Promise = Class({
        constructor: function () {
            if (!this instanceof X.Promise) {
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

        _fulfilledHandlers: null,

        _errorHandlers: null,

        _progressHandlers: null,

        _asyncExec: function () {
            var promise = this
            if (promise._status === PENDING) {
                return
            }


            var phs = null
            if (promise._status === FULFILLED) {
                promise._rejectedArray = []
                phs = promise._fulfilledArray
            } else {
                promise._fulfilledArray = []
                phs = promise._rejectedArray
            }


            setTimeout(function () {
                var ph,
                    val = promise._value

                while (ph = phs.shift()) {
                    try {
                        ph.promise.resolve(ph.handler(val))
                    } catch (e) {
                        promise.reject(e)
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

            if (typeof fulfilledHandler === 'function') {
                this._fulfilledArray.push({
                    promise: promise,
                    handler: fulfilledHandler
                })
            } else {
                this._status === FULFILLED && (promise.resolve(this._value))
            }


            if (typeof rejectedHandler === 'function') {
                this._rejectedArray.push({
                    promise: promise,
                    handler: rejectedHandler
                })
            } else {
                this._status === REJECTED && (promise.reject(this._value))
            }

            this._asyncExec()

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
            this._value = val
            this._status = FULFILLED
            this._asyncExec()

        },
        reject: function (reason) {
            this._value = reason
            this._status = REJECTED
            this._asyncExec()
        },

        notify: function () {

        }
    })


})
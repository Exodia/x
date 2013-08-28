//todo X.bind deal with new operator

(function (global, alias) {
    if (typeof global[alias] === 'function') {
        return
    }

    /**
     * @class X
     * @singleton
     */
    var X = function () {

    }

    X.version = '0.0.0'
    X.__modules = {}


    /**
     * @method bind
     * Creates a new function that, when called, has its this keyword set to the provided value,
     * with a given sequence of arguments preceding any provided when the new function is called.
     *
     * @member X
     *
     * @param {Function} fn The target function to delegate
     * @param {Object} [scope=undefined] The scope (`this` reference) in which the function is executed.
     * The value is ignored if the bound function is constructed using the new operator.
     * **If omitted, defaults to the default global environment object (usually the browser window).**
     * @param {*...} [args]
     * Arguments to prepend to arguments provided to the bound function when invoking the target function.
     *
     * @returns {Function} The new function
     *
     */
    X.bind = function (fn, scope) {
        var slice = [].slice,
            args = slice.call(arguments, 2)

        //native support
        if (typeof fn.bind === 'function') {
            args.unshift(scope)
            return fn.bind.apply(fn, args)
        }

        return function () {
            return fn.apply(scope, args.concat(slice.call(arguments)))
        }
    }

    X.has = X.bind(X.call, Object.prototype.hasOwnProperty)


    /**
     * @method extend Copies all the properties of provided Objects to the target Object
     * **note: this method do not recursive merge**
     * @member X
     * @param {Object} target The receiver of the properties
     * @param {Object...} [args] variable number of object arguments to be copied.
     * @returns {Object} returns the target object
     */
    X.extend = function (target) {
        if (arguments.length == 1) {
            return target
        }

        var i = 1,
            len = arguments.length

        for (; i < len; ++i) {
            X.forEach(arguments[i], function (v, k) {
                target[k] = v
            })
        }
    }

    X.define = typeof define === 'function' && define.amd && define ||
        function (module, deps, factory) {
            if (deps && deps.length) {
                for (var i = 0; i < deps.length; ++i) {
                    deps[i] = X.__modules[deps[i]]
                }
            }

            X.__modules[module] = factory.apply(this, deps || [])
        }

    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = X
    } else if (typeof define !== 'function' || !define.amd) {
        //no amd and no cmd, exposure alias to the global
        global[alias] = X
        global.define = X.define
    }

    X.define('x', [], function () {
        return X
    })

}(typeof global !== 'undefined' ? global : this, 'X'))
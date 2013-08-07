;
(function (global, X) {
    if (typeof global[X] === 'function') {
        return
    }

    X = global[X] = function () {

    }

    X.version = '0.0.0'
    X.__modules = {}

    X.define = function (module, deps, factory) {
        if (typeof define === 'function' && define.amd) {
            define(module, deps, factory)

            return
        }

        if (deps && deps.length) {
            for (var i = 0; i < deps.length; ++i) {
                deps[i] = X.__modules[deps[i]]
            }
        }

        X.__modules[module] = factory.apply(this, deps || [])
    }


    if (typeof module === 'object' && typeof module.exports === 'object') {
        exports.X = X
    }

    X.define('X.core', [], function () {
        return X
    })

    if (typeof define === 'undefined') {
        global.define = X.define;
    }


}(this, 'X'))
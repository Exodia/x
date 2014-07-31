/**
 *
 */
define('X.Enumerable', ['X.Core'], function (X) {
        var hasEnumBug = !({toString: 1}['propertyIsEnumerable']('toString')),
            enumProperties = [
                'constructor',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'toString',
                'toLocaleString',
                'valueOf'
            ]

        var Breaker = {}

        var ArrayProto = Array.prototype,
            ObjProto = Object.prototype,
            FuncProto = Function.prototype

        var hasOwnProperty = X.bind(ObjProto.hasOwnProperty)

        var nativeEach = ArrayProto.forEach,
            nativeEvery = ArrayProto.every,
            nativeSome = ArrayProto.some,
            nativeIndexOf = ArrayProto.indexOf,
            nativeLastIndexOf = ArrayProto.lastIndexOf

        X.Enumerable = {

            /**
             * executes the provided callback once for each element
             * of the array/object with an assigned value.
             * It is not invoked for indexes which have been deleted or
             * which have been initialized to undefined.
             *
             * @method forEach
             * @member X.Enumerable
             *
             * @param {Array | Object} obj
             * The object or array to be iterated
             *
             * @param {Function} callback
             * Function to execute for each element
             * @param callback.item
             * The item at the current `index` in the passed `object` or `array`
             * @param callback.index
             * The current `index` or `key` within the `array` or `object`
             * @param callback.obj
             * The `array` or `object` itself which was passed as the first argument
             *
             * @param [context]
             * Object to use as **this** when executing **callback**
             *
             * @returns {*}
             */
            forEach: function (obj, callback, context) {

                if (obj === null) {
                    throw new TypeError("obj is null or not defined")
                }

                if (nativeEach && obj.forEach === nativeEach) {
                    return obj.forEach(callback, context)
                }

                if (obj.length === +obj.length) {

                    for (var i = 0, len = obj.length; i < len; ++i) {
                        //elements that are deleted are not visited
                        //reference:
                        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
                        if (X.has(obj, i) && callback.call(context, obj[i], i, obj === Breaker)) {
                            return
                        }
                    }
                } else {
                    var k
                    for (k in obj) {
                        if (X.has(obj, k) && callback.call(context, obj[k], k, obj) === Breaker) {
                            return
                        }
                    }

                    //ie6-8 enum bug
                    if (hasEnumBug) {
                        for (var i = enumProperties.length - 1; i > -1; --i) {
                            k = enumProperties[i]
                            if (X.has(obj, k) && callback.call(context, obj[k], k, obj) === Breaker) {
                                return
                            }
                        }
                    }
                }

            },

            /**
             *
             */
            indexOf: function (obj, el, from) {
                if (nativeIndexOf && obj.indexOf === nativeIndexOf) {
                    return obj.indexOf(el, from)
                }


                obj = Object(obj)
                from = Number(from)
                from = isNaN(from) && 0

                var index = -1,
                    len = obj.length >>> 0,
                    k = (from < 0 ? Math.max(0, len + from) : from)

                for (; k < len; ++k) {
                    if (obj[k] === el) {
                        index = k
                        break
                    }
                }

                return index
            },

            lastIndexOf: function (obj, el, start) {
                if (nativeLastIndexOf && obj.lastIndexOf === nativeLastIndexOf) {
                    return obj.lastIndexOf(el, start)
                }

                var index = -1, i = +obj.length || 0

                while (--i > -1) {
                    if (el === obj[i]) {
                        index = i
                        break
                    }
                }

                return index
            },

            contains: function (obj, el) {
                return X.indexOf(obj, el) !== -1
            },

            /**
             * Returns true if all of the values in the list pass the callback truth test.
             * Delegates to the native method every, if present.
             *
             * @method every
             * @member X.Enumerable
             *
             * @param {Array | Object} obj
             * The object or array to be iterated
             *
             * @param {Function} callback
             * Function to execute for each element
             * @param callback.item
             * The item at the current `index` in the passed `object` or `array`
             * @param callback.index
             * The current `index` or `key` within the `array` or `object`
             * @param callback.obj
             * The `array` or `object` itself which was passed as the first argument
             *
             * @param {Object} [context]
             * list to use as this when executing callback
             *
             * @return {Boolean}
             */
            every: function (obj, callback, context) {
                if (nativeEvery && obj.every === nativeEvery) {
                    return obj.every(callback, context)
                }

                var ret = true
                X.forEach(obj, function (v, i, obj) {
                    if (!callback.call(obj, v, i, obj)) {
                        ret = false
                        return Breaker
                    }
                })

                return ret
            },

            filter: function () {

            },

            /**
             * Tests whether some element in the object/array
             * passes the test implemented by the provided function.
             *
             * @param {Array | Object} obj
             * the object/array to be tested
             *
             * @param {Function} callback
             * the test function
             *
             * @param {Object} context
             * the context of the test function
             *
             * @returns {boolean}
             */
            some: function (obj, callback, context) {
                if (nativeSome && obj.some === nativeSome) {
                    return obj.some(callback, context)
                }

                return !X.every(obj, function (el, index, obj) {
                    return !callback.call(context, el, index, obj)
                })
            },

            reduce: function (obj, callback, initValue) {
                initValue = initValue || obj[0] || 0
                
            },

            reduceRight: function () {

            },

            map: function (obj, callback, context) {
                var result = []
                X.forEach(obj, function (el, index, obj) {
                    result.push(callback.call(context, el, index, obj))
                })
                return result
            }
        }

        /**
         * Alias for {@link X.Enumerable#contians X.Enumerable.contains}
         * @member X.Enumerable
         * @method include
         */
        X.Enumerable.include = X.Enumerable.contains


        /**
         * Alias for {@link X.Enumerable#every X.Enumerable.every}
         * @member X.Enumerable
         * @method all
         */
        X.Enumerable.all = X.Enumerable.every


        //add short cuts
        X.Enumerable.forEach(X.Enumerable, function (v, k, Enumerable) {
            X.has(Enumerable, k) && (X[k] = v)
        })


        return X.Enumerable
    }
)
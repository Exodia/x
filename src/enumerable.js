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
            nativeIndexOf = ArrayProto.indexOf,
            nativeLastIndexOf = ArrayProto.lastIndexOf

        X.Enumerable = {

            /**
             * executes the provided iterator once for each element
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
             * @param {Function} iterator
             * Function to execute for each element
             * @param iterator.item
             * The item at the current `index` in the passed `object` or `array`
             * @param iterator.index
             * The current `index` or `key` within the `array` or `object`
             * @param iterator.obj
             * The `array` or `object` itself which was passed as the first argument
             *
             * @param context
             * Object to use as **this** when executing **iterator**
             *
             * @returns {*}
             */
            forEach: function (obj, iterator, context) {

                if (obj === null) {
                    throw new TypeError("obj is null or not defined")
                }

                if (nativeEach && obj.forEach === nativeEach) {
                    return obj.forEach(iterator, context)
                }

                if (obj.length === +obj.length) {

                    for (var i = 0, len = obj.length; i < len; ++i) {
                        //elements that are deleted are not visited
                        //reference:
                        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
                        if (X.has(obj, i) && iterator.call(context, obj[i], i, obj === Breaker)) {
                            return
                        }
                    }
                } else {
                    var k
                    for (k in obj) {
                        if (X.has(obj, k) && iterator.call(context, obj[k], k, obj) === Breaker) {
                            return
                        }
                    }

                    //ie6-8 enum bug
                    if (hasEnumBug) {
                        for (var i = enumProperties.length - 1; i > -1; --i) {
                            k = enumProperties[i]
                            if (X.has(obj, k) && iterator.call(context, obj[k], k, obj) === Breaker) {
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
                    return obj.LastIndexOf(el, start)
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

            every: function (obj, fn, context) {
                X.forEach(obj, function (v, i, obj) {

                })
            },

            filter: function () {

            },

            some: function () {

            },


            reduce: function () {

            },

            reduceRight: function () {

            },

            map: function () {

            }
        }

        /**
         * Alias for {@link X.Enumerable#forEach X.Enumerable.forEach}
         * @member X
         * @method forEach
         */
        X.forEach = X.Enumerable.forEach

        /**
         * Alias for {@link X.Enumerable#contians X.Enumerable.contains}
         * @member X
         * @method contains
         */
        X.contains = X.Enumerable.contains

        /**
         * Alias for {@link X.Enumerable#contians X.Enumerable.contains}
         * @member X
         * @method include
         */
        X.include = X.contains

        return X.Enumerable
    }
)
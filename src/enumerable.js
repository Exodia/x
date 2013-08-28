define('X.Enumerable', ['x'], function (X) {
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


        var nativeEach = ArrayProto.forEach

        X.Enumerable = {
            forEach: function (obj, iterator, context) {
                if (obj === null) {
                    return
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

            }
        }


        X.forEach = X.Enumerable.forEach

        return X.Enumerable
    }
)
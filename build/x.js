/*! x - v0.0.0 - 2013-10-10 */
//TODO: X.bind deal with new operator

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

    /**
     * @method has
     * Detect the object whether contains the given key.
     * Identical to object.hasOwnProperty(key), but uses a safe reference to the hasOwnProperty function,
     * in case it's been overridden accidentally.
     *
     * @member X
     *
     * @param {Object} obj  The object to be detected
     * @param {String} key  The key name to be detected
     * @return {Boolean} The detected result
     *
     */
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

    /**
     * @method define
     * @member X
     */
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
    }

    if (typeof define !== 'function' || !define.amd) {
        //no amd and no cmd, exposure alias to the global
        global[alias] = X
        global.define = X.define
    }

    X.define('X.Core', [], function () {
        return X
    })

}(typeof global !== 'undefined' ? global : this, 'X'));
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
             * @param [context]
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
         * Alias for {@link X.Enumerable#contians X.Enumerable.contains}
         * @member X
         * @method include
         */
        X.Enumerable.include = X.Enumerable.contains


        /**
         * Alias for {@link X.Enumerable#forEach X.Enumerable.forEach}
         * @member X
         * @method forEach
         */

        /**
         * Alias for {@link X.Enumerable#contians X.Enumerable.contains}
         * @member X
         * @method contains
         */
        X.Enumerable.forEach(X.Enumerable, function (v, k, Enumerable) {
            X.has(Enumerable, k) && (X[k] = v)
        })



        return X.Enumerable
    }
);
/**
 * @class X.Class
 * A simple implement of OO Class System
 *
 * See the example:
 *      @example
 *      //create a simple Super class
 *      var Super = X.Class.create({
 *          constructor: function(prop1, prop2){
 *            this.prop1 = prop1
 *            this.prop2 = prop2
 *            alert("Super init")
 *          },
 *          method: function () {
 *               alert('Super method')
 *          }
 *      })
 *
 *      //create a Sub class which inherits the Super class
 *      var Sub = X.Class.create(Super, {
 *          constructor: function(prop1, prop2, prop3){
 *             //call the Super Class's "constructor" method,
 *             //and pass the arguments
 *             this.$super(arguments)
 *             this.prop3 = prop3
 *             alert("Sub init")
 *          }
 *      })
 *
 *      var Sub1 = X.Class.create(Sub, {
 *          constructor: function(prop1, prop2, prop3){
 *             //call the Sub Class's "constructor" method,
 *             //and pass the arguments
 *             this.$super(arguments)
 *             alert("Sub1 init")
 *          },
 *          method: function(){
 *              //call the Sub's "method1" method
 *              this.$super(arguments)
 *              alert('Sub1 method')
 *          }
 *      })
 *
 *      var sub1 = new Sub1 //alert: Super init, Sub init, Sub1 init
 *      sub1.method() //alert: Super method, Sub1 method
 */
define('X.Class', ['X.Core'], function (X) {
    var slice = [].slice,
        apply = X.extend

    /**
     * @constructor
     * Create an anonymous class
     * usage: new X.Class(config)  or  X.Class.create(config)
     *
     * @member X.Class
     * @return {X.Class}
     */
    var Class = function () {
        return Class.create.apply(Class, slice.call(arguments))
    }

    apply(Class, {
        /**
         * Return a X.Class instance function, equal new Class(Super, overrides)
         * @method create
         * @member X.Class
         * @static
         *
         * @param {X.Class/Function} Super (optional)
         * Optional, the parent class that this class extends, can be ignored.
         *
         * @param {Object} overrides
         * A Class config, which will be added to the prototype of the Class,
         * and shared by the Class instances!
         * However, there are some special important config properties as follows:
         *
         * @param {Function} overrides.constructor An initialize method.
         * When creating a instance from a Class, this method will always be called
         *
         * @param {Object} overrides.__statics
         * Every key and value in overrides.__statics will be added to the Class Object,
         * just as the static properties.
         * You can use the Class.prop to retrieve the static property.
         *
         * @returns {X.Class}
         */
        create: function (Super, overrides) {

            var kclass = Class._extend(Class)

            if (typeof Super === 'function') {
                kclass = Class._extend(Super)
                overrides = overrides || {}
            } else if (typeof Super === 'object') {
                overrides = Super
            } else {
                overrides = {}
            }

            var proto = kclass.prototype,
                protoStatics = proto.__statics,
                overStatics = overrides.__statics

            //覆盖其余属性
            X.forEach(overrides, function (v, k) {
                if (typeof v === 'function') {
                    v.__name__ = k
                    v.__owner__ = kclass
                }
                k !== '__statics' && (proto[k] = v)
            })

            //覆盖静态属性
            overStatics && X.forEach(overStatics, function (v, k) {
                kclass[k] = protoStatics[k] = v
            })

            return kclass
        },

        /**
         * @method _extend
         * used for X.Class.create method
         *
         * @member X.Class
         * @private
         * @static
         *
         * @param {X.Class} superCls
         * the super class to inherit
         *
         * @returns {X.Class}
         */
        _extend: function (superCls) {
            var kclass = function () {
                return kclass.prototype.constructor.apply(this, arguments)
            }

            if (typeof superCls !== 'function') {
                return kclass
            }

            var fn = function () {

            }

            fn.prototype = superCls.prototype
            kclass.prototype = new fn
            kclass.__super = superCls

            apply(kclass.prototype, {
                $self: kclass,
                __statics: {}
            })

            var statics = superCls.prototype.__statics

            for (var k  in statics) {
                kclass[k] = kclass.prototype.__statics[k] = statics[k]
            }

            return kclass
        },

        /**
         * @property {X.Class} __super
         * the reference of the Super Class
         *
         * @private
         * @static
         * @member X.Class
         */
        __super: null
    })

    apply(Class.prototype, {
        /**
         * @property {X.Class} $self
         *
         * Get the reference to the current class from which this object was instantiated.
         * `this.self` is scope-dependent and it's meant to be used for dynamic inheritance.
         *
         *      var Frog = X.Class({
         *          __statics: {
         *              name: 'Frog'         //Super.name = 'Frog'
         *          },
         *          getName: function(){
         *              alert(this.$self.name)  //dependent on 'this'
         *          }
         *      })
         *
         *      var Dog = X.Class({
         *          __statics: {
         *              name: 'Dog'         //Super.name = 'Dog'
         *          },
         *          getName: function(){
         *              alert(this.$self.name)  //dependent on 'this'
         *          }
         *      })
         *
         *      var frog = new Frog,
         *          dog = new Dog
         *
         *      frog.getName()  //alerts 'Frog'
         *      dog.getName()  //alerts 'Dog'
         */
        $self: Class,

        /**
         * @property {Object} __statics
         * the key map of the Class's Statics properties
         *
         * @private
         * @member X.Class
         */
        __statics: {},

        constructor: function () {
        },


        /*
         * 想实现 $super('methodName', arguments)的功能，无奈，只能实现一层继承的调用，
         * 多层无法实现，先不搞了。。么么哒！！
         * */
        /*$super: function (name) {

         if (typeof name !== 'string' || !(name instanceof String)) {
         throw "$super's first argument must be a string"
         }

         var superCls = this.$self.__super,
         fn = superCls.prototype[name]

         if (typeof fn !== 'function') {
         throw "Call the super class's " + name + ", but it is not a function!"
         }

         if (fn.__called__) {
         delete fn.__called__

         fn = fn.__owner__.__super.prototype[name]

         if (typeof fn !== 'function') {
         throw "Call the super class's " + name + ", but it is not a function!"
         }
         }


         return fn.apply(this, slice.call(arguments, 1))
         },*/

        /* 非严格模式下使用，
         * 不支持函数嵌套调用：
         * function(){ function(){ this.$super() } }
         */

        /**
         * call the super class's method,
         * note: can not used in strict mode
         *
         * @method $super
         * @member X.Class
         *
         * @params {Object/Array} args
         * The arguments object or array passed to the method
         *
         * @returns {*}
         */
        $super: function (args) {
            var method = this.$super.caller,
                name = method.__name__,
                superCls = method.__owner__.__super,
                superMethod = superCls.prototype[name]


            if (typeof superMethod !== 'function') {
                throw "Call the super class's " + name + ", but it is not a function!"
            }

            return superMethod.apply(this, args)
        }
    })

    X.Class = Class

    return Class
});
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
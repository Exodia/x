/*! x - v0.0.0 - 2013-09-09 */
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
    } else if (typeof define !== 'function' || !define.amd) {
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
             * @method forEach 待添加
             * @member X.Enumerable
             * @param obj
             * @param iterator
             * @param context
             * @returns {*}
             */
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

            },

            each: function (obj, iterator, context) {
                X.forEach(obj, function (v, i, obj) {
                    return iterator.apply(context, i, v, obj)
                })
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

                var index = -1, len = obj.length >>> 0,
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
        return Class.create(slice.call(arguments))
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
                this.constructor.apply(this, arguments)
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
})
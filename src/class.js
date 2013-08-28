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
 *             //and pass the prop1, prop2 as the arguments
 *             this.$super(prop1, prop2)
 *             this.prop3 = prop3
 *             alert("Sub init")
 *          }
 *      })
 *
 *      var Sub1 = X.Class.create(Sub, {
 *          constructor: function(prop1, prop2, prop3){
 *             //call the Sub Class's "constructor" method,
 *             //and pass the prop1, prop2, prop3 as the arguments
 *             this.$super(prop1, prop2, prop3)
 *             alert("Sub1 init")
 *          },
 *          method: function(){
 *              //call the Sub's "method1" method
 *              this.$super()
 *              alert('Sub1 method')
 *          }
 *      })
 *
 *      var sub1 = new Sub1 //alert: Super init, Sub init, Sub1 init
 *      sub1.method() //alert: Super method, Sub1 method
 */
define('X.Class', ['x'], function (X) {
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
         * @method $super
         * call the super class's method,
         * note: can not used in strict mode
         *
         * @member X.Class
         *
         * @returns {*}
         */
        $super: function () {
            var method = this.$super.caller,
                name = method.__name__,
                superCls = method.__owner__.__super,
                superMethod = superCls.prototype[name]


            if (typeof superMethod !== 'function') {
                throw "Call the super class's " + name + ", but it is not a function!"
            }

            return superMethod.apply(this, arguments)
        }
    })

    X.Class = Class

    return Class
})
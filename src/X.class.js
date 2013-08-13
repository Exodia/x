;
/**
 * X.class
 *
 * @example
 *      var Super = X.Class.create({
 *          constructor: function(){
 *            this.prop1 = 1
 *            this.prop2 = 2
 *          },
 *          method1: function () {
 *               alert('super method1')
 *          }
 *      })
 *
 *      var Sub = X.Class.create(Super, {
 *          constructor: function(){
 *
 *          }
 *      })
 */
define('X.class', ['X.core'], function (X) {
    var slice = [].slice,
        apply = function (obj, props) {
            for (var k in props) {
                obj[k] = props[k]
            }
        }

    var Class = function () {
        return Class.create(slice.call(arguments))
    }

    apply(Class, {
        create: function (Super, overrides) {

            var kclass = Class.extend(Class)

            if (Super instanceof Class) {
                kclass = Class.extend(kclass)
                overrides = {}
            } else if (typeof Super === 'object') {
                overrides = Super
            } else {
                throw new Error("Class create error: The first arguments should be an X.Class or Object")
            }

            var proto = kclass.prototype,
                protoStatics = proto.__statics,
                overStatics = overrides.__statics,
                k


            //覆盖其余属性
            for (k in overrides) {
                k !== 'statics' && (proto[k] = overrides[k])
            }

            //覆盖静态属性
            for (k in overStatics) {
                kclass[k] = overStatics[k]
                protoStatics[k] = overStatics[k]
            }

            return kclass


        },
        extend: function (superCls) {
            var kclass = function () {
                this.$self = kclass
                this.__initialize.apply(this, arguments)
            }

            if (typeof superCls !== 'function') {
                return kclass
            }

            var fn = function () {

            }

            fn.prototype = superCls.prototype
            kclass.prototype = new fn
            kclass.prototype.constructor = kclass
            kclass.prototype.$super = superCls
            kclass.prototype.__statics = {}

            if (typeof kclass.prototype.__initialize !== 'function') {
                kclass.prototype.__initialize = function () {
                }
            }

            apply(kclass.prototype.__statics, superCls.prototype.__statics)

            return kclass

        }

    })


    X.Class = Class

    return Class
})
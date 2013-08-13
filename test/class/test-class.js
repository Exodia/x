describe('X.class Base Test', function () {
    var statics = {
        staticProp1: 1,
        staticProp2: 2,
        staticMethod1: function () {

        },
        staticMethod2: function () {

        }
    }

    var init = function (prop1, prop2) {
        this.superProp1 = prop1
        this.superProp2 = prop2
    }

    var Super = X.Class.create({
        __initialize: init,
        __statics: statics,
        superMethod1: function () {
            console.log('super method1')
        },
        superMethod2: function () {
            console.log('super method2')
        }
    })


    /* var Sub1 = X.Class.create(Super, {
     constructor: function () {
     this.$super(arguments)
     this.sub1Prop1 = 'sub1-1'
     this.sub2Prop2 = 'sub1-2'
     },
     sub1Method1: function () {
     this.$super(arguments)
     console.log('sub1 method1')
     },
     sub1Method2: function () {
     console.log('sub2 method2')
     }
     })

     var Sub2 = X.Class.create(Sub1, {
     constructor: function () {
     this.$super(arguments)
     this.sub2Prop1 = 'sub2-1'
     this.sub2Prop2 = 'sub2-2'
     },
     sub2Method1: function () {
     this.$super(arguments)
     console.log('sub method1')
     },
     sub2Method2: function () {
     console.log('sub method2')
     }
     })
     */

    it("class's __initialize is set", function () {
        var ins = new Super()
        expect(Super.prototype.__initialize).to.be(init)
        expect(ins.__initialize).to.be(init)
    })

    it("class's __initialize is called", function () {
        var fn = function () {
        }
        var ins = new Super(1, fn)

        expect(ins.superProp1).to.equal(1)
        expect(ins.superProp2).to.equal(fn)
    })

    it("instance's self is set to the class", function () {
        var ins = new Super

        expect(ins.$self).to.equal(Super)
    })

    it("__statics is set", function () {
        expect(Super.prototype.__statics).to.be(statics)
        for (var k in statics) {
            expect(Super[k]).to.equal(statics[k])
        }
    })

})
//'use strict'
describe('X.class Inherit Test', function () {
    var statics = {
        staticProp1: 1,
        staticProp2: 2,
        staticMethod1: function () {

        },
        staticMethod2: function () {

        }
    }

    var Super = X.Class.create({
        __initialize: function (prop1, prop2) {
            this.superProp1 = prop1
            this.superProp2 = prop2
        },
        __statics: statics,
        superMethod1: function () {
            console.log('super method1')
        },
        superMethod2: function () {
            console.log('super method2')
        }
    })

    var Sub1 = X.Class.create(Super, {
        __initialize: function (prop1, prop2) {
            this.$$super(prop1, prop2)
            this.sub1Prop1 = 'sub1-1'
            this.sub1Prop2 = 'sub1-2'
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
        __initialize: function (prop1, prop2, prop3) {
            this.$$super(prop1, prop2)
            this.sub2Prop1 = 'sub2-1'
            this.sub2Prop2 = 'sub2-2'
            this.sub2Prop3 = prop3
        },
        sub2Method1: function () {
            this.$$super(arguments)
            console.log('sub method1')
        },
        sub2Method2: function () {
            console.log('sub method2')
        }
    })


    describe("One level inheritance test", function () {
        var sub1 = new Sub1(1, 2, 3)

        it("sub1's $$super are called", function () {
            expect(sub1.superProp1).to.equal(1)
            expect(sub1.superProp2).to.equal(2)
        })

        it("sub1's Super methods are set", function () {
            expect(sub1.superMethod1).to.equal(Super.prototype.superMethod1)
            expect(sub1.superMethod2).to.equal(Super.prototype.superMethod2)
        })

        it("sub1's static properties are set", function () {
            for(var k in statics) {
                expect(Sub1[k]).to.equal(statics[k])
            }
        })

        it("sub1's own properties are set", function () {
            expect(sub1.sub1Prop1).to.equal('sub1-1')
            expect(sub1.sub1Prop2).to.equal('sub1-2')
        })

        it("sub1's own methods are set", function () {
            expect(sub1.sub1Method1).to.equal(Sub1.prototype.sub1Method1)
            expect(sub1.sub1Method2).to.equal(Sub1.prototype.sub1Method2)
        })

        it("sub1's $self is set", function () {
            expect(sub1.$self).to.equal(Sub1)

        })

        it("Super __initialize method is called", function () {
            var ins = new (X.Class.create(Super))(1, 2)

            expect(ins.superProp1).to.equal(1)
            expect(ins.superProp2).to.equal(2)
        })
    })

    sub = new Sub2(1,2,3)

//    console.log(sub)
//    sub.sub2Method1()


})
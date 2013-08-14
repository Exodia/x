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

    it("instance's $self is set to the class", function () {
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

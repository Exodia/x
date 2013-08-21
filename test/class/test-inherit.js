describe('X.class Inherit Test', function () {
    var superStatics = {
        superSProp1: 1,
        superSProp2: 2,
        supersfn1: function () {
            return this.superSProp1
        },
        supersfn2: function () {
            return this.superSProp2
        },
        seach: function (arr, fn) {
            for (var i = 0; i < arr.length; ++i) {
                fn.call(arr, arr[i], i, arr)
            }
        },
        splus: function () {
            var sum = 0
            this.each(arguments, function (v) {
                sum += v
            })

            return sum
        }
    }

    var sub1Statics = {
        sub1SProp1: 1,
        sub1SProp2: 2,
        sub1sfn1: function () {
            return this.splus(this.supersfn1() + this.sub1SProp1)
        },
        sub1sfn2: function () {
            return this.splus(this.supersfn2() + this.sub1SProp2)
        },
        sminus: function () {
            var sum = 0
            this.each(arguments, function (v) {
                sum -= v
            })

            return sum
        }
    }

    var sub2Statics = {
        sub2SProp1: 1,
        sub2SProp2: 2,
        sub2sfn1: function () {
            return this.splus(this.sub1sfn1() + this.sub2SProp1)
        },
        sub2sfn2: function () {
            return this.splus(this.sub1sfn2() + this.sub2SProp2)
        },
        smulti: function () {
            var sum = 1
            this.each(arguments, function (v) {
                sum *= v
            })

            return sum
        }
    }

    var Super = X.Class.create({
        constructor: function (prop1, prop2) {
            this.superProp1 = prop1
            this.superProp2 = prop2
        },
        __statics: superStatics,
        fn1: function () {
            return this.superProp1
        },
        fn2: function () {
            return this.superProp2
        },
        each: function (arr, fn) {
            for (var i = 0; i < arr.length; ++i) {
                fn.call(arr, arr[i], i, arr)
            }
        },
        plus: function () {
            var sum = 0
            this.each(arguments, function (v) {
                sum += v
            })

            return sum
        }
    })

    var Sub1 = X.Class.create(Super, {
        constructor: function (prop1, prop2, prop3, prop4) {
            this.$$super(prop1, prop2)
            this.sub1Prop1 = prop3
            this.sub1Prop2 = prop4
        },
        __statics: sub1Statics,
        fn1: function () {
            return this.plus(this.$$super() + this.sub1Prop1)
        },
        fn2: function () {
            return this.plus(this.$$super() + this.sub1Prop2)
        },
        minus: function () {
            var sum = 0
            this.each(arguments, function (v) {
                sum -= v
            })

            return sum
        }
    })

    var Sub2 = X.Class.create(Sub1, {
        constructor: function (prop1, prop2, prop3, prop4, prop5, prop6) {
            this.$$super(prop1, prop2, prop3, prop4)
            this.sub2Prop1 = prop5
            this.sub2Prop2 = prop6
        },
        __statics: sub2Statics,
        fn1: function () {
            return this.plus(this.$$super() + this.sub2Prop1)
        },
        fn2: function () {
            return this.plus(this.$$super() + this.sub2Prop2)
        },
        multi: function () {
            var sum = 1
            this.each(arguments, function (v) {
                sum *= v
            })

            return sum
        }
    })


    describe("One level inheritance test", function () {
        var sup = new Super(1, 2)
        var sub1 = new Sub1(1, 2, 3, 4)
        var sub2 = new Sub2(1, 2, 3, 4, 5, 6)

        it("sub1's $$super are called", function () {
            expect(sub1.superProp1).to.equal(1)
            expect(sub1.superProp2).to.equal(2)
        })

        it("sub1's Super methods are set", function () {
            expect(sub1.each).to.equal(sub1.$self.__super.prototype.each)
            expect(sub1.each).to.equal(sup.each)
        })

      /*  it("sub1's static properties are set", function () {
            for (var k in statics) {
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

        it("Super constructor method is called", function () {
            var ins = new (X.Class.create(Super))(1, 2)

            expect(ins.superProp1).to.equal(1)
            expect(ins.superProp2).to.equal(2)
        })*/
    })


})
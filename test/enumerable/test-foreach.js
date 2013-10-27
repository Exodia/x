describe('X.Enumberable.forEach Test', function () {

    function equal(a, b, des) {
        return it(des, function () {
            expect(a).to.be(b)
        })
    }

    X.forEach([1, 2, 3], function (num, i) {
        equal(num, i + 1, 'each iterators provide value and iteration count')
    })

    var answers = []
    X.forEach([1, 2, 3], function (num) {
        answers.push(num * this.multiplier)
    }, {multiplier: 5})

    equal(answers.join(', '), '5, 10, 15', 'context object property accessed')

    answers = []
    X.forEach([1, 2, 3], function (num) {
        answers.push(num)
    })
    equal(answers.join(', '), '1, 2, 3', 'aliased as "forEach"')

    var obj = {one: 1, two: 2, three: 3}
    obj.constructor.prototype.four = 4
    
    it('iterating over objects works, and ignores the object prototype.', function () {
        var answers = []

        X.forEach(obj, function (value, key) {
            answers.push(key)
        })
        expect(answers.join(', ')).to.be('one, two, three')
    })
    delete obj.constructor.prototype.four

    var answer = null

    X.forEach([1, 2, 3], function (num, index, arr) {
        if (X.include(arr, num)) answer = true
    })
    equal(answer, true, 'can reference the original collection from inside the iterator')

    answers = 0
    it('when null passed as the arguments, throw TypeError', function () {
        expect(X.forEach).withArgs(null,function () {
            ++answers
        }).to.throwException(
            function (e) {
                expect(e).to.be.a(TypeError)
            }
        )
    })
    equal(answers, 0, 'handles a null properly')

    /*X.forEach([1, 2, 3], function (num, index, arr) {
        arr.splice(0, arr.length)
        ++answers
    })
    equal(answers, 1, 'dynamic remove element in array')*/
})
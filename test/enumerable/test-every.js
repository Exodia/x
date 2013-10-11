describe('X.Enumberable.every Test', function () {
    function ok(v, des) {
        return it(des, function () {
            expect(v).to.be(true)
        })
    }

    identity = function (v) {
        return v
    }

    ok(X.every([], identity), 'the empty set');
    ok(X.every([true, true, true], identity), 'all true values');
    ok(!X.every([true, false, true], identity), 'one false value');
    ok(X.every([0, 10, 28], function (num) {
        return num % 2 == 0;
    }), 'even numbers');
    ok(!X.every([0, 11, 28], function (num) {
        return num % 2 == 0;
    }), 'an odd number');
    ok(X.every([1], identity) === true, 'cast to boolean - true');
    ok(X.every([0], identity) === false, 'cast to boolean - false');
    ok(X.all([true, true, true], identity), 'aliased as "every"');
    ok(!X.every([undefined, undefined, undefined], identity), 'works with arrays of undefined');
})
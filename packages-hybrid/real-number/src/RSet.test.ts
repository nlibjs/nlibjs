import {Infinity} from '@nlib/global';
import test from 'ava';
import {RSet} from './RSet';
import * as index from './index';
import {closeclose, openopen, closeopen, openclose} from './RInterval';
import {testRSetLikeConstructor} from './types';

test('index', (t) => {
    t.is(index.RSet, RSet);
});

test('static methods', (t) => {
    testRSetLikeConstructor(RSet);
    t.pass();
});

test('empty set', (t) => {
    t.true(RSet.equal(
        RSet.empty(),
        RSet.empty(),
    ));
    t.false(RSet.equal(
        RSet.fromInterval(openopen(0, 1)),
        RSet.empty(),
    ));
    t.false(RSet.equal(
        RSet.empty(),
        RSet.fromInterval(openopen(0, 1)),
    ));
});

test('complement({[0, 1](2, 3)}) → {(-Infinity, 0)(1, 2][3, Infinity)}', (t) => {
    t.true(RSet.equal(
        RSet.complement(RSet.union(
            closeclose(0, 1),
            openopen(2, 3),
        )),
        RSet.union(
            openopen(-Infinity, 0),
            openclose(1, 2),
            closeopen(3, Infinity),
        ),
    ));
});

test('union({[0, 1]}, {(2, 3)}, {(2, 4]}) → {[0, 1](2, 4]}', (t) => {
    t.true(RSet.equal(
        RSet.union(
            RSet.fromInterval(closeclose(0, 1)),
            RSet.fromInterval(openopen(2, 3)),
            RSet.fromInterval(openclose(2, 4)),
        ),
        RSet.union(
            closeclose(0, 1),
            openclose(2, 4),
        ),
    ));
});

test('union([0, 1], (2, 3), (2, 4]) → {[0, 1](2, 4]}', (t) => {
    t.true(RSet.equal(
        RSet.union(
            closeclose(0, 1),
            openopen(2, 3),
            openclose(2, 4),
        ),
        RSet.union(
            closeclose(0, 1),
            openclose(2, 4),
        ),
    ));
});

test('intersection({[0, 3][10, 20]}, {(2, 4)(12, 16)}, {[1, 5)[14, 18]}) → {(2, 3][14, 16)}', (t) => {
    t.true(RSet.equal(
        RSet.intersection(
            RSet.union(closeclose(0, 3), closeclose(10, 20)),
            RSet.union(openopen(2, 4), openopen(12, 16)),
            RSet.union(closeopen(1, 5), closeclose(14, 18)),
        ),
        RSet.union(openclose(2, 3), closeopen(14, 16)),
    ));
});

test('intersection([10, 20], (12, 16), [14, 18]) → {[14, 16)}', (t) => {
    t.true(RSet.equal(
        RSet.intersection(
            RSet.fromInterval(closeclose(10, 20)),
            RSet.fromInterval(openopen(12, 16)),
            RSet.fromInterval(closeclose(14, 18)),
        ),
        RSet.fromInterval(closeopen(14, 16)),
    ));
});

test('{[0, 0]}', (t) => {
    const set = RSet.fromInterval(closeclose(0, 0));
    t.false(set.isEmpty);
    t.true(set.has(0));
    t.false(set.has(1));
    t.false(RSet.complement(set).has(0));
    t.true(RSet.complement(set).has(1));
});

test('{(0, 0)}', (t) => {
    const set = RSet.fromInterval(openopen(0, 0));
    t.true(set.isEmpty);
    t.false(set.has(0));
    t.false(set.has(1));
    t.true(RSet.complement(set).has(0));
    t.true(RSet.complement(set).has(1));
});

test('{(-Infinity, Infinity)}', (t) => {
    const set = RSet.fromInterval(openopen(-Infinity, Infinity));
    t.false(set.isEmpty);
    t.true(set.has(0));
    t.false(set.has(-Infinity));
    t.false(set.has(Infinity));
    t.true(RSet.complement(set).isEmpty);
    t.false(RSet.complement(set).has(0));
    t.false(RSet.complement(set).has(1));
});

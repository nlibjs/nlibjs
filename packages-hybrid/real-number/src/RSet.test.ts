import {Infinity} from '@nlib/global';
import test from 'ava';
import {RSet} from './RSet';
import * as index from './index';
import {inin, exex, inex, exin} from './RInterval';
import {testSetLikeConstructor} from './types';

test('index', (t) => {
    t.is(index.RSet, RSet);
});

test('static methods', (t) => {
    testSetLikeConstructor(RSet);
    t.pass();
});

test('empty set', (t) => {
    t.true(RSet.equal(
        RSet.empty(),
        RSet.empty(),
    ));
    t.false(RSet.equal(
        RSet.fromInterval(exex(0, 1)),
        RSet.empty(),
    ));
    t.false(RSet.equal(
        RSet.empty(),
        RSet.fromInterval(exex(0, 1)),
    ));
});

test('complement({[0, 1](2, 3)}) → {(-Infinity, 0)(1, 2][3, Infinity)}', (t) => {
    t.true(RSet.equal(
        RSet.complement(RSet.union(
            inin(0, 1),
            exex(2, 3),
        )),
        RSet.union(
            exex(-Infinity, 0),
            exin(1, 2),
            inex(3, Infinity),
        ),
    ));
});

test('union({[0, 1]}, {(2, 3)}, {(2, 4]}) → {[0, 1](2, 4]}', (t) => {
    t.true(RSet.equal(
        RSet.union(
            RSet.fromInterval(inin(0, 1)),
            RSet.fromInterval(exex(2, 3)),
            RSet.fromInterval(exin(2, 4)),
        ),
        RSet.union(
            inin(0, 1),
            exin(2, 4),
        ),
    ));
});

test('union([0, 1], (2, 3), (2, 4]) → {[0, 1](2, 4]}', (t) => {
    t.true(RSet.equal(
        RSet.union(
            inin(0, 1),
            exex(2, 3),
            exin(2, 4),
        ),
        RSet.union(
            inin(0, 1),
            exin(2, 4),
        ),
    ));
});

test('intersection({[0, 3][10, 20]}, {(2, 4)(12, 16)}, {[1, 5)[14, 18]}) → {(2, 3][14, 16)}', (t) => {
    t.true(RSet.equal(
        RSet.intersection(
            RSet.union(inin(0, 3), inin(10, 20)),
            RSet.union(exex(2, 4), exex(12, 16)),
            RSet.union(inex(1, 5), inin(14, 18)),
        ),
        RSet.union(exin(2, 3), inex(14, 16)),
    ));
});

test('intersection([10, 20], (12, 16), [14, 18]) → {[14, 16)}', (t) => {
    t.true(RSet.equal(
        RSet.intersection(
            RSet.fromInterval(inin(10, 20)),
            RSet.fromInterval(exex(12, 16)),
            RSet.fromInterval(inin(14, 18)),
        ),
        RSet.fromInterval(inex(14, 16)),
    ));
});

test('{[0, 0]}', (t) => {
    const set = RSet.fromInterval(inin(0, 0));
    t.false(set.isEmpty);
    t.true(set.has(0));
    t.false(set.has(1));
    t.false(RSet.complement(set).has(0));
    t.true(RSet.complement(set).has(1));
});

test('{(0, 0)}', (t) => {
    const set = RSet.fromInterval(exex(0, 0));
    t.true(set.isEmpty);
    t.false(set.has(0));
    t.false(set.has(1));
    t.true(RSet.complement(set).has(0));
    t.true(RSet.complement(set).has(1));
});

test('{(-Infinity, Infinity)}', (t) => {
    const set = RSet.fromInterval(exex(-Infinity, Infinity));
    t.false(set.isEmpty);
    t.true(set.has(0));
    t.false(set.has(-Infinity));
    t.false(set.has(Infinity));
    t.true(RSet.complement(set).isEmpty);
    t.false(RSet.complement(set).has(0));
    t.false(RSet.complement(set).has(1));
});

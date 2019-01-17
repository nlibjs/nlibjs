import {Infinity} from '@nlib/global';
import test from 'ava';
import {ZSet} from './ZSet';
import * as index from './index';
import {inin, exex, inex, exin} from './RInterval';
import {testSetLikeConstructor} from './types';

test('index', (t) => {
    t.is(index.ZSet, ZSet);
});

test('static methods', (t) => {
    testSetLikeConstructor(ZSet);
    t.pass();
});

test('empty set', (t) => {
    t.true(ZSet.equal(
        ZSet.empty(),
        ZSet.empty(),
    ));
    t.false(ZSet.equal(
        ZSet.fromInterval(exex(0, 1)),
        ZSet.empty(),
    ));
    t.false(ZSet.equal(
        ZSet.empty(),
        ZSet.fromInterval(exex(0, 1)),
    ));
});

test('complement({[0, 1](2, 3)}) → {(-Infinity, 0)(1, 2][3, Infinity)}', (t) => {
    t.true(ZSet.equal(
        ZSet.complement(ZSet.union(
            inin(0, 1),
            exex(2, 3),
        )),
        ZSet.union(
            exex(-Infinity, 0),
            exin(1, 2),
            inex(3, Infinity),
        ),
    ));
});

test('union({[0, 1]}, {(2, 3)}, {(2, 4]}) → {[0, 1](2, 4]}', (t) => {
    t.true(ZSet.equal(
        ZSet.union(
            ZSet.fromInterval(inin(0, 1)),
            ZSet.fromInterval(exex(2, 3)),
            ZSet.fromInterval(exin(2, 4)),
        ),
        ZSet.union(
            inin(0, 1),
            exin(2, 4),
        ),
    ));
});

test('union([0, 1], (2, 3), (2, 4]) → {[0, 1](2, 4]}', (t) => {
    t.true(ZSet.equal(
        ZSet.union(
            inin(0, 1),
            exex(2, 3),
            exin(2, 4),
        ),
        ZSet.union(
            inin(0, 1),
            exin(2, 4),
        ),
    ));
});

test('intersection({[0, 3][10, 20]}, {(2, 4)(12, 16)}, {[1, 5)[14, 18]}) → {(2, 3][14, 16)}', (t) => {
    t.true(ZSet.equal(
        ZSet.intersection(
            ZSet.union(inin(0, 3), inin(10, 20)),
            ZSet.union(exex(2, 4), exex(12, 16)),
            ZSet.union(inex(1, 5), inin(14, 18)),
        ),
        ZSet.union(exin(2, 3), inex(14, 16)),
    ));
});

test('intersection([10, 20], (12, 16), [14, 18]) → {[14, 16)}', (t) => {
    t.true(ZSet.equal(
        ZSet.intersection(
            ZSet.fromInterval(inin(10, 20)),
            ZSet.fromInterval(exex(12, 16)),
            ZSet.fromInterval(inin(14, 18)),
        ),
        ZSet.fromInterval(inex(14, 16)),
    ));
});

test('{[0, 0]}', (t) => {
    const set = ZSet.fromInterval(inin(0, 0));
    t.false(set.isEmpty);
    t.true(set.has(0));
    t.false(set.has(1));
    t.false(ZSet.complement(set).has(0));
    t.true(ZSet.complement(set).has(1));
});

test('{[0, 2]}', (t) => {
    const set = ZSet.fromInterval(inin(0, 2));
    t.false(set.isEmpty);
    t.true(set.has(0));
    t.true(set.has(1));
    t.true(set.has(2));
    t.false(set.has(0.1));
    t.false(ZSet.complement(set).has(0));
    t.false(ZSet.complement(set).has(0.1));
    t.true(ZSet.complement(set).has(-1));
    t.true(ZSet.complement(set).has(3));
});

test('{(0, 0)}', (t) => {
    const set = ZSet.fromInterval(exex(0, 0));
    t.true(set.isEmpty);
    t.false(set.has(0));
    t.false(set.has(1));
    t.true(ZSet.complement(set).has(0));
    t.true(ZSet.complement(set).has(1));
});

test('{(-Infinity, Infinity)}', (t) => {
    const set = ZSet.fromInterval(exex(-Infinity, Infinity));
    t.false(set.isEmpty);
    t.true(set.has(0));
    t.false(set.has(-Infinity));
    t.false(set.has(Infinity));
    t.true(ZSet.complement(set).isEmpty);
    t.false(ZSet.complement(set).has(0));
    t.false(ZSet.complement(set).has(1));
});

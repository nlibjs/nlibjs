import {Infinity} from '@nlib/global';
import test from 'ava';
import {
    emptyZ,
    equalZ,
    fromIntervalZ,
    unionZ,
    intersectionZ,
    complementZ,
} from './ZSet';
import * as index from './index';
import {inin, exex, inex, exin} from './RInterval';

test('index', (t) => {
    t.is(index.emptyZ, emptyZ);
    t.is(index.equalZ, equalZ);
    t.is(index.fromIntervalZ, fromIntervalZ);
    t.is(index.unionZ, unionZ);
    t.is(index.intersectionZ, intersectionZ);
    t.is(index.complementZ, complementZ);
});

test('empty set', (t) => {
    t.true(equalZ(
        emptyZ(),
        emptyZ(),
    ));
    t.false(equalZ(
        fromIntervalZ(exex(0, 1)),
        emptyZ(),
    ));
    t.false(equalZ(
        emptyZ(),
        fromIntervalZ(exex(0, 1)),
    ));
});

test('complement({[0, 1](2, 3)}) → {(-Infinity, 0)(1, 2][3, Infinity)}', (t) => {
    t.true(equalZ(
        complementZ(unionZ(
            inin(0, 1),
            exex(2, 3),
        )),
        unionZ(
            exex(-Infinity, 0),
            exin(1, 2),
            inex(3, Infinity),
        ),
    ));
});

test('union({[0, 1]}, {(2, 3)}, {(2, 4]}) → {[0, 1](2, 4]}', (t) => {
    t.true(equalZ(
        unionZ(
            fromIntervalZ(inin(0, 1)),
            fromIntervalZ(exex(2, 3)),
            fromIntervalZ(exin(2, 4)),
        ),
        unionZ(
            inin(0, 1),
            exin(2, 4),
        ),
    ));
});

test('union([0, 1], (2, 3), (2, 4]) → {[0, 1](2, 4]}', (t) => {
    t.true(equalZ(
        unionZ(
            inin(0, 1),
            exex(2, 3),
            exin(2, 4),
        ),
        unionZ(
            inin(0, 1),
            exin(2, 4),
        ),
    ));
});

test('intersection({[0, 3][10, 20]}, {(2, 4)(12, 16)}, {[1, 5)[14, 18]}) → {(2, 3][14, 16)}', (t) => {
    t.true(equalZ(
        intersectionZ(
            unionZ(inin(0, 3), inin(10, 20)),
            unionZ(exex(2, 4), exex(12, 16)),
            unionZ(inex(1, 5), inin(14, 18)),
        ),
        unionZ(exin(2, 3), inex(14, 16)),
    ));
});

test('intersection([10, 20], (12, 16), [14, 18]) → {[14, 16)}', (t) => {
    t.true(equalZ(
        intersectionZ(
            fromIntervalZ(inin(10, 20)),
            fromIntervalZ(exex(12, 16)),
            fromIntervalZ(inin(14, 18)),
        ),
        fromIntervalZ(inex(14, 16)),
    ));
});

test('{[0, 0]}', (t) => {
    const set = fromIntervalZ(inin(0, 0));
    t.false(set.isEmpty);
    t.true(set.has(0));
    t.false(set.has(1));
    t.false(complementZ(set).has(0));
    t.true(complementZ(set).has(1));
});

test('{[0, 2]}', (t) => {
    const set = fromIntervalZ(inin(0, 2));
    t.false(set.isEmpty);
    t.true(set.has(0));
    t.true(set.has(1));
    t.true(set.has(2));
    t.false(set.has(0.1));
    t.false(complementZ(set).has(0));
    t.false(complementZ(set).has(0.1));
    t.true(complementZ(set).has(-1));
    t.true(complementZ(set).has(3));
});

test('{(0, 0)}', (t) => {
    const set = fromIntervalZ(exex(0, 0));
    t.true(set.isEmpty);
    t.false(set.has(0));
    t.false(set.has(1));
    t.true(complementZ(set).has(0));
    t.true(complementZ(set).has(1));
});

test('{(-Infinity, Infinity)}', (t) => {
    const set = fromIntervalZ(exex(-Infinity, Infinity));
    t.false(set.isEmpty);
    t.true(set.has(0));
    t.false(set.has(-Infinity));
    t.false(set.has(Infinity));
    t.true(complementZ(set).isEmpty);
    t.false(complementZ(set).has(0));
    t.false(complementZ(set).has(1));
});

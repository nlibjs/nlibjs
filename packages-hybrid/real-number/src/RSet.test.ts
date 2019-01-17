import {Infinity} from '@nlib/global';
import test from 'ava';
import {RSet, equalR, emptyR, fromIntervalR, complementR, unionR, intersectionR} from './RSet';
import * as index from './index';
import {inin, exex, inex, exin} from './RInterval';

test('index', (t) => {
    t.is(index.RSet, RSet);
});

test('empty set', (t) => {
    t.true(equalR(
        emptyR(),
        emptyR(),
    ));
    t.false(equalR(
        fromIntervalR(exex(0, 1)),
        emptyR(),
    ));
    t.false(equalR(
        emptyR(),
        fromIntervalR(exex(0, 1)),
    ));
});

test('complement({[0, 1](2, 3)}) → {(-Infinity, 0)(1, 2][3, Infinity)}', (t) => {
    t.true(equalR(
        complementR(unionR(
            inin(0, 1),
            exex(2, 3),
        )),
        unionR(
            exex(-Infinity, 0),
            exin(1, 2),
            inex(3, Infinity),
        ),
    ));
});

test('union({[0, 1]}, {(2, 3)}, {(2, 4]}) → {[0, 1](2, 4]}', (t) => {
    t.true(equalR(
        unionR(
            fromIntervalR(inin(0, 1)),
            fromIntervalR(exex(2, 3)),
            fromIntervalR(exin(2, 4)),
        ),
        unionR(
            inin(0, 1),
            exin(2, 4),
        ),
    ));
});

test('union([0, 1], (2, 3), (2, 4]) → {[0, 1](2, 4]}', (t) => {
    t.true(equalR(
        unionR(
            inin(0, 1),
            exex(2, 3),
            exin(2, 4),
        ),
        unionR(
            inin(0, 1),
            exin(2, 4),
        ),
    ));
});

test('intersection({[0, 3][10, 20]}, {(2, 4)(12, 16)}, {[1, 5)[14, 18]}) → {(2, 3][14, 16)}', (t) => {
    t.true(equalR(
        intersectionR(
            unionR(inin(0, 3), inin(10, 20)),
            unionR(exex(2, 4), exex(12, 16)),
            unionR(inex(1, 5), inin(14, 18)),
        ),
        unionR(exin(2, 3), inex(14, 16)),
    ));
});

test('intersection([10, 20], (12, 16), [14, 18]) → {[14, 16)}', (t) => {
    t.true(equalR(
        intersectionR(
            fromIntervalR(inin(10, 20)),
            fromIntervalR(exex(12, 16)),
            fromIntervalR(inin(14, 18)),
        ),
        fromIntervalR(inex(14, 16)),
    ));
});

test('{[0, 0]}', (t) => {
    const set = fromIntervalR(inin(0, 0));
    t.false(set.isEmpty);
    t.true(set.has(0));
    t.false(set.has(1));
    t.false(complementR(set).has(0));
    t.true(complementR(set).has(1));
});

test('{(0, 0)}', (t) => {
    const set = fromIntervalR(exex(0, 0));
    t.true(set.isEmpty);
    t.false(set.has(0));
    t.false(set.has(1));
    t.true(complementR(set).has(0));
    t.true(complementR(set).has(1));
});

test('{(-Infinity, Infinity)}', (t) => {
    const set = fromIntervalR(exex(-Infinity, Infinity));
    t.false(set.isEmpty);
    t.true(set.has(0));
    t.false(set.has(-Infinity));
    t.false(set.has(Infinity));
    t.true(complementR(set).isEmpty);
    t.false(complementR(set).has(0));
    t.false(complementR(set).has(1));
});

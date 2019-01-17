import {Infinity} from '@nlib/global';
import test from 'ava';
import {
    exex,
    exin,
    inex,
    inin,
    eq,
    equalI,
    compareFunctionI,
    intersectionI,
    unionI,
    RInterval,
} from './RInterval';
import * as index from './index';

test('index', (t) => {
    t.is(index.exex, exex);
    t.is(index.exin, exin);
    t.is(index.inex, inex);
    t.is(index.inin, inin);
    t.is(index.RInterval, RInterval);
});

test('compare intervals', (t) => {
    t.true(equalI(exex(0, 1), exex(0, 1)));
    t.false(equalI(exex(0, 1), exex(0, 2)));
    t.false(equalI(exex(0, 1), exin(0, 1)));
    t.false(equalI(exex(0, 1), inex(0, 1)));
    t.false(equalI(exex(0, 1), inin(0, 1)));
});

test('rejects inverse ends', (t) => {
    t.throws(() => exex(1, 0));
    t.throws(() => exin(1, 0));
    t.throws(() => inex(1, 0));
    t.throws(() => inin(1, 0));
});

test('isEmpty', (t) => {
    t.false(inin(0, 0).isEmpty);
    t.true(exin(0, 0).isEmpty);
    t.true(inex(0, 0).isEmpty);
    t.true(exex(0, 0).isEmpty);
});

test('exex rejects NaN', (t) => {
    t.throws(() => exex(NaN, NaN));
    t.throws(() => exex(0, NaN));
    t.throws(() => exex(NaN, 0));
});

test('exin rejects NaN', (t) => {
    t.throws(() => exin(NaN, NaN));
    t.throws(() => exin(0, NaN));
    t.throws(() => exin(NaN, 0));
});

test('inex rejects NaN', (t) => {
    t.throws(() => inex(NaN, NaN));
    t.throws(() => inex(0, NaN));
    t.throws(() => inex(NaN, 0));
});

test('inin rejects NaN', (t) => {
    t.throws(() => inin(NaN, NaN));
    t.throws(() => inin(0, NaN));
    t.throws(() => inin(NaN, 0));
});

test('exin rejects Infinite rightEnd', (t) => {
    t.throws(() => exin(0, Infinity));
});

test('inex rejects Infinite leftEnd', (t) => {
    t.throws(() => inex(-Infinity, 0));
});

test('inin rejects Infinite ends', (t) => {
    t.throws(() => inin(-Infinity, 0));
    t.throws(() => inin(0, Infinity));
    t.throws(() => inin(-Infinity, Infinity));
});

test('exex(0, 2)', (t) => {
    const interval = exex(0, 2);
    t.false(interval.has(-1));
    t.false(interval.has(0));
    t.true(interval.has(1));
    t.false(interval.has(2));
    t.false(interval.has(3));
});

test('exin(0, 2)', (t) => {
    const interval = exin(0, 2);
    t.false(interval.has(-1));
    t.false(interval.has(0));
    t.true(interval.has(1));
    t.true(interval.has(2));
    t.false(interval.has(3));
});

test('inex(0, 2)', (t) => {
    const interval = inex(0, 2);
    t.false(interval.has(-1));
    t.true(interval.has(0));
    t.true(interval.has(1));
    t.false(interval.has(2));
    t.false(interval.has(3));
});

test('inin(0, 2)', (t) => {
    const interval = inin(0, 2);
    t.false(interval.has(-1));
    t.true(interval.has(0));
    t.true(interval.has(1));
    t.true(interval.has(2));
    t.false(interval.has(3));
});

test('eq(0)', (t) => {
    const interval = eq(0);
    t.false(interval.has(-1));
    t.true(interval.has(0));
    t.false(interval.has(1));
});

test('sort intervals', (t) => {
    const i1 = exex(1, 1);
    const i2 = inin(1, 1);
    const i3 = exex(0, 1);
    const i4 = inin(1, 2);
    const i5 = inin(0, 1);
    const result = [i1, i2, i3, i4, i5].sort(compareFunctionI);
    t.deepEqual(result, [i5, i3, i2, i4, i1]);
});

test('intersection((0, 3), [1, 4]) → [1, 3)', (t) => {
    const result = intersectionI(exex(0, 3), inin(1, 4));
    t.true(result && equalI(result, inex(1, 3)));
});

test('union((0, 3), [1, 4]) → (0, 4]', (t) => {
    const result = unionI(exex(0, 3), inin(1, 4));
    t.true(result && equalI(result, exin(0, 4)));
});

test('intersection((0, 3), [1, 2]) → [1, 2]', (t) => {
    const result = intersectionI(exex(0, 3), inin(1, 2));
    t.true(result && equalI(result, inin(1, 2)));
});

test('union((0, 3), [1, 2]) → (0, 3)', (t) => {
    const result = unionI(exex(0, 3), inin(1, 2));
    t.true(result && equalI(result, exex(0, 3)));
});

test('intersection((0, 1), [1, 2]) → null', (t) => {
    const result = intersectionI(exex(0, 1), inin(1, 2));
    t.is(result, null);
});

test('union((0, 1), [1, 2]) → (0, 2]', (t) => {
    const result = unionI(exex(0, 1), inin(1, 2));
    t.true(result && equalI(result, exin(0, 2)));
});

test('intersection((0, 1], [1, 2]) → [1, 1]', (t) => {
    const result = intersectionI(exin(0, 1), inin(1, 2));
    t.true(result && equalI(result, inin(1, 1)));
});

test('union((0, 1), [2, 3]) → null', (t) => {
    const result = unionI(exex(0, 1), inin(2, 3));
    t.is(result, null);
});

test('union((-Infinity, 1), [0, Infinity)) → (-Infinity, Infinity)', (t) => {
    const result = unionI(exex(-Infinity, 1), inex(0, Infinity));
    t.true(result && equalI(result, exex(-Infinity, Infinity)));
});

test('exex(0, 1).toString() = (0, 1)', (t) => {
    t.is(exex(0, 1).toString(), '(0, 1)');
});

test('exin(0, 1).toString() = (0, 1]', (t) => {
    t.is(exin(0, 1).toString(), '(0, 1]');
});

test('inex(0, 1).toString() = [0, 1)', (t) => {
    t.is(inex(0, 1).toString(), '[0, 1)');
});

test('inin(0, 1).toString() = [0, 1]', (t) => {
    t.is(inin(0, 1).toString(), '[0, 1]');
});

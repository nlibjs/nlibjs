import {Infinity} from '@nlib/global';
import test from 'ava';
import {
    openopen,
    openclose,
    closeopen,
    closeclose,
    RInterval,
} from './RInterval';
import * as index from './index';

test('index', (t) => {
    t.is(index.openopen, openopen);
    t.is(index.openclose, openclose);
    t.is(index.closeopen, closeopen);
    t.is(index.closeclose, closeclose);
    t.is(index.RInterval, RInterval);
});

test('compare intervals', (t) => {
    t.true(RInterval.equal(openopen(0, 1), openopen(0, 1)));
    t.false(RInterval.equal(openopen(0, 1), openopen(0, 2)));
    t.false(RInterval.equal(openopen(0, 1), openclose(0, 1)));
    t.false(RInterval.equal(openopen(0, 1), closeopen(0, 1)));
    t.false(RInterval.equal(openopen(0, 1), closeclose(0, 1)));
});

test('rejects inverse ends', (t) => {
    t.throws(() => openopen(1, 0));
    t.throws(() => openclose(1, 0));
    t.throws(() => closeopen(1, 0));
    t.throws(() => closeclose(1, 0));
});

test('isEmpty', (t) => {
    t.false(closeclose(0, 0).isEmpty);
    t.true(openclose(0, 0).isEmpty);
    t.true(closeopen(0, 0).isEmpty);
    t.true(openopen(0, 0).isEmpty);
});

test('openopen rejects NaN', (t) => {
    t.throws(() => openopen(NaN, NaN));
    t.throws(() => openopen(0, NaN));
    t.throws(() => openopen(NaN, 0));
});

test('openclose rejects NaN', (t) => {
    t.throws(() => openclose(NaN, NaN));
    t.throws(() => openclose(0, NaN));
    t.throws(() => openclose(NaN, 0));
});

test('closeopen rejects NaN', (t) => {
    t.throws(() => closeopen(NaN, NaN));
    t.throws(() => closeopen(0, NaN));
    t.throws(() => closeopen(NaN, 0));
});

test('closeclose rejects NaN', (t) => {
    t.throws(() => closeclose(NaN, NaN));
    t.throws(() => closeclose(0, NaN));
    t.throws(() => closeclose(NaN, 0));
});

test('openclose rejects Infinite rightEnd', (t) => {
    t.throws(() => openclose(0, Infinity));
});

test('closeopen rejects Infinite leftEnd', (t) => {
    t.throws(() => closeopen(-Infinity, 0));
});

test('closeclose rejects Infinite ends', (t) => {
    t.throws(() => closeclose(-Infinity, 0));
    t.throws(() => closeclose(0, Infinity));
    t.throws(() => closeclose(-Infinity, Infinity));
});

test('openopen(0, 2)', (t) => {
    const interval = openopen(0, 2);
    t.false(interval.has(-1));
    t.false(interval.has(0));
    t.true(interval.has(1));
    t.false(interval.has(2));
    t.false(interval.has(3));
});

test('openclose(0, 2)', (t) => {
    const interval = openclose(0, 2);
    t.false(interval.has(-1));
    t.false(interval.has(0));
    t.true(interval.has(1));
    t.true(interval.has(2));
    t.false(interval.has(3));
});

test('closeopen(0, 2)', (t) => {
    const interval = closeopen(0, 2);
    t.false(interval.has(-1));
    t.true(interval.has(0));
    t.true(interval.has(1));
    t.false(interval.has(2));
    t.false(interval.has(3));
});

test('closeclose(0, 2)', (t) => {
    const interval = closeclose(0, 2);
    t.false(interval.has(-1));
    t.true(interval.has(0));
    t.true(interval.has(1));
    t.true(interval.has(2));
    t.false(interval.has(3));
});

test('sort intervals', (t) => {
    const i1 = openopen(1, 1);
    const i2 = closeclose(1, 1);
    const i3 = openopen(0, 1);
    const i4 = closeclose(1, 2);
    const i5 = closeclose(0, 1);
    const result = [i1, i2, i3, i4, i5].sort(RInterval.compareFunction);
    t.deepEqual(result, [i5, i3, i2, i4, i1]);
});

test('intersection((0, 3), [1, 4]) → [1, 3)', (t) => {
    const result = RInterval.intersection(openopen(0, 3), closeclose(1, 4));
    t.true(result && RInterval.equal(result, closeopen(1, 3)));
});

test('union((0, 3), [1, 4]) → (0, 4]', (t) => {
    const result = RInterval.union(openopen(0, 3), closeclose(1, 4));
    t.true(result && RInterval.equal(result, openclose(0, 4)));
});

test('intersection((0, 3), [1, 2]) → [1, 2]', (t) => {
    const result = RInterval.intersection(openopen(0, 3), closeclose(1, 2));
    t.true(result && RInterval.equal(result, closeclose(1, 2)));
});

test('union((0, 3), [1, 2]) → (0, 3)', (t) => {
    const result = RInterval.union(openopen(0, 3), closeclose(1, 2));
    t.true(result && RInterval.equal(result, openopen(0, 3)));
});

test('intersection((0, 1), [1, 2]) → null', (t) => {
    const result = RInterval.intersection(openopen(0, 1), closeclose(1, 2));
    t.is(result, null);
});

test('union((0, 1), [1, 2]) → (0, 2]', (t) => {
    const result = RInterval.union(openopen(0, 1), closeclose(1, 2));
    t.true(result && RInterval.equal(result, openclose(0, 2)));
});

test('intersection((0, 1], [1, 2]) → [1, 1]', (t) => {
    const result = RInterval.intersection(openclose(0, 1), closeclose(1, 2));
    t.true(result && RInterval.equal(result, closeclose(1, 1)));
});

test('union((0, 1), [2, 3]) → null', (t) => {
    const result = RInterval.union(openopen(0, 1), closeclose(2, 3));
    t.is(result, null);
});

test('union((-Infinity, 1), [0, Infinity)) → (-Infinity, Infinity)', (t) => {
    const result = RInterval.union(openopen(-Infinity, 1), closeopen(0, Infinity));
    t.true(result && RInterval.equal(result, openopen(-Infinity, Infinity)));
});

test('openopen(0, 1).toString() = (0, 1)', (t) => {
    t.is(openopen(0, 1).toString(), '(0, 1)');
});

test('openclose(0, 1).toString() = (0, 1]', (t) => {
    t.is(openclose(0, 1).toString(), '(0, 1]');
});

test('closeopen(0, 1).toString() = [0, 1)', (t) => {
    t.is(closeopen(0, 1).toString(), '[0, 1)');
});

test('closeclose(0, 1).toString() = [0, 1]', (t) => {
    t.is(closeclose(0, 1).toString(), '[0, 1]');
});

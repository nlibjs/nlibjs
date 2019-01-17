import {Number, Infinity} from '@nlib/global';
import test from 'ava';
import {gt, gte, lte, lt, equalC, complementC, compareFunctionC, RCut} from './RCut';
import * as index from './index';

test('index', (t) => {
    t.is(index.gt, gt);
    t.is(index.gte, gte);
    t.is(index.lt, lt);
    t.is(index.lte, lte);
    t.is(index.RCut, RCut);
});

test('compare cuts', (t) => {
    t.true(equalC(gt(0), gt(0)));
    t.false(equalC(gt(0), gt(1)));
});

test('gt(NaN) is invalid', (t) => {
    t.throws(() => gt(NaN));
});

test('gt(0)', (t) => {
    const cut = gt(0);
    t.is(cut.number, 0);
    t.true(cut.onRight);
    t.false(cut.onLeft);
    t.true(cut.exclusive);
    t.false(cut.inclusive);
    t.false(cut.has(-1));
    t.false(cut.has(-0));
    t.false(cut.has(0));
    t.false(cut.has(+0));
    t.true(cut.has(1));
});

test('complement(gt(0))', (t) => {
    t.true(equalC(complementC(gt(0)), lte(0)));
});

test('gt(-Infinity)', (t) => {
    const cut = gt(-Infinity);
    t.true(cut.number < 0);
    t.false(Number.isFinite(cut.number));
    t.true(cut.onRight);
    t.false(cut.onLeft);
    t.true(cut.exclusive);
    t.false(cut.inclusive);
    t.false(cut.has(-Infinity));
    t.true(cut.has(0));
    t.true(cut.has(Infinity));
});

test('gt(Infinity)', (t) => {
    const cut = gt(Infinity);
    t.true(0 < cut.number);
    t.false(Number.isFinite(cut.number));
    t.true(cut.onRight);
    t.false(cut.onLeft);
    t.true(cut.exclusive);
    t.false(cut.inclusive);
    t.false(cut.has(-Infinity));
    t.false(cut.has(0));
    t.false(cut.has(Infinity));
});

test('gte(NaN) is invalid', (t) => {
    t.throws(() => gte(NaN));
});

test('gte(0)', (t) => {
    const cut = gte(0);
    t.is(cut.number, 0);
    t.true(cut.onRight);
    t.false(cut.onLeft);
    t.false(cut.exclusive);
    t.false(cut.has(-1));
    t.true(cut.has(-0));
    t.true(cut.has(0));
    t.true(cut.has(+0));
    t.true(cut.has(1));
});

test('complement(gte(0))', (t) => {
    t.true(equalC(complementC(gte(0)), lt(0)));
});

test('gte(-Infinity) is invalid', (t) => {
    t.throws(() => gte(-Infinity));
});

test('gte(Infinity) is invalid', (t) => {
    t.throws(() => gte(Infinity));
});

test('lt(NaN) is invalid', (t) => {
    t.throws(() => lt(NaN));
});

test('lt(0)', (t) => {
    const cut = lt(0);
    t.is(cut.number, 0);
    t.false(cut.onRight);
    t.true(cut.onLeft);
    t.true(cut.exclusive);
    t.false(cut.inclusive);
    t.true(cut.has(-1));
    t.false(cut.has(-0));
    t.false(cut.has(0));
    t.false(cut.has(+0));
    t.false(cut.has(1));
});

test('complement(lt(0))', (t) => {
    t.true(equalC(complementC(lt(0)), gte(0)));
});

test('lt(-Infinity)', (t) => {
    const cut = lt(-Infinity);
    t.true(cut.number < 0);
    t.false(Number.isFinite(cut.number));
    t.false(cut.onRight);
    t.true(cut.onLeft);
    t.true(cut.exclusive);
    t.false(cut.inclusive);
    t.false(cut.has(-Infinity));
    t.false(cut.has(0));
    t.false(cut.has(Infinity));
});

test('lt(Infinity)', (t) => {
    const cut = lt(Infinity);
    t.true(0 < cut.number);
    t.false(Number.isFinite(cut.number));
    t.false(cut.onRight);
    t.true(cut.onLeft);
    t.true(cut.exclusive);
    t.false(cut.inclusive);
    t.true(cut.has(-Infinity));
    t.true(cut.has(0));
    t.false(cut.has(Infinity));
});

test('lte(NaN) is invalid', (t) => {
    t.throws(() => lte(NaN));
});

test('lte(0)', (t) => {
    const cut = lte(0);
    t.is(cut.number, 0);
    t.false(cut.onRight);
    t.true(cut.onLeft);
    t.false(cut.exclusive);
    t.true(cut.has(-1));
    t.true(cut.has(-0));
    t.true(cut.has(0));
    t.true(cut.has(+0));
    t.false(cut.has(1));
});

test('complement(lte(0))', (t) => {
    t.true(equalC(complementC(lte(0)), gt(0)));
});

test('lte(-Infinity) is invalid', (t) => {
    t.throws(() => lte(-Infinity));
});

test('lte(Infinity) is invalid', (t) => {
    t.throws(() => lte(Infinity));
});

test('sort cuts (different numbers)', (t) => {
    const c1 = lte(3);
    const c2 = lte(2);
    const c3 = lte(1);
    const c4 = lte(0);
    t.deepEqual([c1, c2, c3, c4].sort(compareFunctionC), [c4, c3, c2, c1]);
});

test('sort cuts (same numbers)', (t) => {
    const c1 = lte(0);
    const c2 = lt(0);
    const c3 = gt(0);
    const c4 = gte(0);
    t.deepEqual([c1, c2, c3, c4].sort(compareFunctionC), [c4, c3, c2, c1]);
});

test('gt(0).toString() = (0, Infinity)', (t) => {
    t.is(gt(0).toString(), '(0, Infinity)');
});

test('gte(0).toString() = [0, Infinity)', (t) => {
    t.is(gte(0).toString(), '[0, Infinity)');
});

test('lt(0).toString() = [0, Infinity)', (t) => {
    t.is(lt(0).toString(), '(-Infinity, 0)');
});

test('lte(0).toString() = [0, Infinity)', (t) => {
    t.is(lte(0).toString(), '(-Infinity, 0]');
});

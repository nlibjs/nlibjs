import test from 'ava';
import {NumberComparator} from './NumberComparator';

test('NumberComparator.eq:operator', (t) => {
    t.is(NumberComparator.eq(0).operator, 'eq');
});

test('NumberComparator.eq:threshold', (t) => {
    t.is(NumberComparator.eq(1).threshold, 1);
});

test('NumberComparator.eq:compare', (t) => {
    const comparator = NumberComparator.eq(0);
    t.true(comparator.compare(0));
    t.true(comparator.compare(+0));
    t.true(comparator.compare(-0));
    t.false(comparator.compare(-1));
    t.false(comparator.compare(1));
});

test('NumberComparator.eq:is', (t) => {
    t.true(NumberComparator.eq(0).is('eq', 0));
    t.false(NumberComparator.eq(0).is('neq', 0));
    t.false(NumberComparator.eq(0).is('eq', 1));
    t.true(NumberComparator.eq(0).is(NumberComparator.eq(0)));
    t.false(NumberComparator.eq(0).is(NumberComparator.neq(0)));
    t.false(NumberComparator.eq(0).is(NumberComparator.eq(1)));
});

test('NumberComparator.eq:covers', (t) => {
    t.true(NumberComparator.eq(0).covers(NumberComparator.eq(0)));
    t.false(NumberComparator.eq(0).covers(NumberComparator.neq(0)));
    t.false(NumberComparator.eq(0).covers(NumberComparator.eq(1)));
});

test('NumberComparator.eq:inverse', (t) => {
    t.true(NumberComparator.eq(0).inverse().is(NumberComparator.neq(0)));
});

test('NumberComparator.neq:operator', (t) => {
    t.is(NumberComparator.neq(0).operator, 'neq');
});

test('NumberComparator.neq:threshold', (t) => {
    t.is(NumberComparator.neq(1).threshold, 1);
});

test('NumberComparator.neq:compare', (t) => {
    const comparator = NumberComparator.neq(0);
    t.false(comparator.compare(0));
    t.false(comparator.compare(+0));
    t.false(comparator.compare(-0));
    t.true(comparator.compare(-1));
    t.true(comparator.compare(1));
});

test('NumberComparator.neq:is', (t) => {
    t.true(NumberComparator.neq(0).is('neq', 0));
    t.false(NumberComparator.neq(0).is('eq', 0));
    t.false(NumberComparator.neq(0).is('neq', 1));
    t.true(NumberComparator.neq(0).is(NumberComparator.neq(0)));
    t.false(NumberComparator.neq(0).is(NumberComparator.eq(0)));
    t.false(NumberComparator.neq(0).is(NumberComparator.neq(1)));
});

test('NumberComparator.neq:covers', (t) => {
    t.true(NumberComparator.neq(0).covers(NumberComparator.neq(0)));
    t.false(NumberComparator.neq(0).covers(NumberComparator.eq(0)));
    t.false(NumberComparator.neq(0).covers(NumberComparator.neq(1)));
});

test('NumberComparator.neq:inverse', (t) => {
    t.true(NumberComparator.neq(0).inverse().is(NumberComparator.eq(0)));
});

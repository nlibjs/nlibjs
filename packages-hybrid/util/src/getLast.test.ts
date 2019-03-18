import test from 'ava';
import {JSON} from '@nlib/global';
import {getLast} from './getLast';
import * as index from './index';

test('index.getLast', (t) => {
    t.is(index.getLast, getLast);
});

interface ITest {
    value: ArrayLike<any>,
    index?: number,
    expected: any,
}

test('getLast([]) → throw an Error', (t) => {
    t.throws(() => getLast([]));
});

test('getLast([1], 1) → throw an Error', (t) => {
    t.throws(() => getLast([1], 1));
});

test('getLast([1], -1.1) → throw an Error', (t) => {
    t.throws(() => getLast([1], -1.1));
});

([
    {value: [0, 1, 2], expected: 2},
    {value: [0, 1, 2], index: -1, expected: 2},
    {value: [0, 1, 2], index: -2, expected: 1},
    {value: [0, 1, 2], index: -3, expected: 0},
] as Array<ITest>).forEach(({value, index, expected}) => {
    test(`getLast(${JSON.stringify(value)}, ${index}) → ${expected}`, (t) => {
        t.is(getLast(value, index), expected);
    });
});

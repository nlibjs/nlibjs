import test from 'ava';
import {JSON} from '@nlib/global';
import {getLast} from './getLast';
import * as index from './index';

test('index.getLast', (t) => {
    t.is(index.getLast, getLast);
});

interface ITest {
    value: ArrayLike<any>,
    expected: any,
}

test('getLast([]) → throw an Error', (t) => {
    t.throws(() => getLast([]));
});

([
    {value: [0, 1, 2], expected: 2},
] as Array<ITest>).forEach(({value, expected}) => {
    test(`getLast(${JSON.stringify(value)}) → ${expected}`, (t) => {
        t.is(getLast(value), expected);
    });
});

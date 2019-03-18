import test from 'ava';
import {Infinity} from '@nlib/global';
import {stringify} from './stringify';
import * as index from './index';

test('index.stringify', (t) => {
    t.is(index.stringify, stringify);
});

const tests: Array<[number, string]> = [
    [0, '0'],
    [Infinity, 'Infinity'],
    [-Infinity, '-Infinity'],
];

for (const [value, expected] of tests) {
    test(`${value} → ${expected}`, (t) => {
        t.is(stringify(value), expected);
    });
}

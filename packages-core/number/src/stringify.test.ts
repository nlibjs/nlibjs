import test from 'ava';
import {Infinity} from '@nlib/global';
import {stringify} from './stringify';

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

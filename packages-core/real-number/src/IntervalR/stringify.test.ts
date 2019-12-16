import test from 'ava';
import {Infinity} from '@nlib/global';
import {stringifyIntervalR} from './stringify';
import {IntervalR} from './types';

const tests: Array<[IntervalR, string]> = [
    [[false, -Infinity, Infinity, false], '(-Infinity, Infinity)'],
    [[false, -10, 10, false], '(-10, 10)'],
    [[true, -10, 10, false], '[-10, 10)'],
    [[false, -10, 10, true], '(-10, 10]'],
    [[true, -10, 10, true], '[-10, 10]'],
];

for (const [IntervalR, expected] of tests) {
    test(`${IntervalR.join(', ')} → ${expected}`, (t) => {
        t.is(stringifyIntervalR(IntervalR), expected);
    });
}


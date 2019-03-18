import test from 'ava';
import {Infinity} from '@nlib/global';
import {hasIntervalZ} from './has';
import {IntervalZ} from './types';
import * as index from '../index';
import {stringifyIntervalZ} from './stringify';

test('index.hasIntervalZ', (t) => {
    t.is(index.hasIntervalZ, hasIntervalZ);
});

const tests: Array<[IntervalZ, Array<[number, boolean]>]> = [
    [
        [-Infinity, Infinity],
        [
            [-Infinity, false],
            [0, true],
            [Infinity, false],
        ],
    ],
    [
        [1, 4],
        [
            [0, false],
            [1, true],
            [1.1, false],
            [2, true],
            [3, true],
            [4, true],
            [5, false],
        ],
    ],
];

for (const [interval, cases] of tests) {
    for (const [value, expected] of cases) {
        test(`has(${stringifyIntervalZ(interval)}, ${value}) → ${expected}`, (t) => {
            t.is(hasIntervalZ(interval, value), expected);
        });
    }
}


import test from 'ava';
import {Infinity} from '@nlib/global';
import {hasIntervalR} from './has';
import {IntervalR} from './types';
import {stringifyIntervalR} from './stringify';
import * as index from '../index';

test('index.hasIntervalR', (t) => {
    t.is(index.hasIntervalR, hasIntervalR);
});

const tests: Array<[IntervalR, Array<[number, boolean]>]> = [
    [
        [false, -Infinity, Infinity, false],
        [
            [-Infinity, true],
            [0, true],
            [Infinity, true],
        ],
    ],
    [
        [false, 1, 4, false],
        [
            [0, false],
            [1, false],
            [2, true],
            [3, true],
            [4, false],
            [5, false],
        ],
    ],
    [
        [true, 1, 4, false],
        [
            [0, false],
            [1, true],
            [2, true],
            [3, true],
            [4, false],
            [5, false],
        ],
    ],
    [
        [false, 1, 4, true],
        [
            [0, false],
            [1, false],
            [2, true],
            [3, true],
            [4, true],
            [5, false],
        ],
    ],
    [
        [true, 1, 4, true],
        [
            [0, false],
            [1, true],
            [2, true],
            [3, true],
            [4, true],
            [5, false],
        ],
    ],
];

for (const [interval, cases] of tests) {
    for (const [value, expected] of cases) {
        test(`has(${stringifyIntervalR(interval)}, ${value}) → ${expected}`, (t) => {
            t.is(hasIntervalR(interval, value), expected);
        });
    }
}


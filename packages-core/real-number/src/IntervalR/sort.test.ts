import test from 'ava';
import {IntervalR} from './types';
import {
    sortIntervalR,
    sortIntervalR2,
} from './sort';
import {stringifyIntervalR} from './stringify';
import * as index from '../index';

test('index.sortIntervalR', (t) => {
    t.is(index.sortIntervalR, sortIntervalR);
});

test('index.sortIntervalR2', (t) => {
    t.is(index.sortIntervalR2, sortIntervalR2);
});

const tests: Array<[Array<IntervalR>, Array<IntervalR>]> = [
    [
        [
            [false, -5, 5, true],
            [true, -5, 5, true],
        ],
        [
            [true, -5, 5, true],
            [false, -5, 5, true],
        ],
    ],
    [
        [
            [false, -5, 5, true],
            [false, -5, 5, false],
        ],
        [
            [false, -5, 5, false],
            [false, -5, 5, true],
        ],
    ],
    [
        [
            [false, -4, 5, false],
            [false, -5, 5, false],
        ],
        [
            [false, -5, 5, false],
            [false, -4, 5, false],
        ],
    ],
    [
        [
            [false, -5, 5, false],
            [false, -5, 4, false],
        ],
        [
            [false, -5, 4, false],
            [false, -5, 5, false],
        ],
    ],
];

for (const [list, expected] of tests) {
    test(`${list.map(stringifyIntervalR).join('')} → ${expected.map(stringifyIntervalR).join('-')}`, (t) => {
        t.deepEqual(list.sort(sortIntervalR), expected);
        t.deepEqual(expected.sort(sortIntervalR), expected);
        if (list.length === 2) {
            t.deepEqual(sortIntervalR2(list[0], list[1]), expected);
        }
    });
}

import test from 'ava';
import {unionIntervalZ} from './union';
import {IntervalZ} from './types';
import {stringifyIntervalZ} from './stringify';

const tests: Array<[Array<IntervalZ>, IntervalZ | null]> = [
    [
        [],
        null,
    ],
    [
        [
            [0, 0],
            [0, 0],
        ],
        [0, 0],
    ],
    [
        [
            [0, 0],
            [0, 1],
        ],
        [0, 1],
    ],
    [
        [
            [0, 0],
            [1, 1],
        ],
        [0, 1],
    ],
    [
        [
            [0, 0],
            [1, 1],
            [2, 2],
        ],
        [0, 2],
    ],
    [
        [
            [0, 0],
            [2, 2],
        ],
        null,
    ],
];

for (const [list, expected] of tests) {
    test(`unionIntervalZ(${list.map(stringifyIntervalZ).join(', ')}) → ${expected ? stringifyIntervalZ(expected) : expected}`, (t) => {
        t.deepEqual(unionIntervalZ(...list), expected);
        t.deepEqual(unionIntervalZ(...list.reverse()), expected);
    });
}

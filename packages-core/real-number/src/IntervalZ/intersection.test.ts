import test from 'ava';
import {intersectionIntervalZ} from './intersection';
import {IntervalZ} from './types';
import {stringifyIntervalZ} from './stringify';
import * as index from './index';

test('index.intersectionIntervalZ', (t) => {
    t.is(index.intersectionIntervalZ, intersectionIntervalZ);
});

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
        [0, 0],
    ],
    [
        [
            [0, 0],
            [1, 1],
        ],
        null,
    ],
    [
        [
            [1, 1],
            [0, 2],
        ],
        [1, 1],
    ],
];

for (const [list, expected] of tests) {
    test(`intersectionR(${list.map(stringifyIntervalZ).join(', ')}) → ${expected ? stringifyIntervalZ(expected) : expected}`, (t) => {
        t.deepEqual(intersectionIntervalZ(...list), expected);
        t.deepEqual(intersectionIntervalZ(...list.reverse()), expected);
    });
}

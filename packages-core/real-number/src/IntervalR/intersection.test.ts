import test from 'ava';
import {intersectionIntervalR} from './intersection';
import {IntervalR} from './types';
import {stringifyIntervalR} from './stringify';
import * as index from './index';

test('index.intersectionIntervalR', (t) => {
    t.is(index.intersectionIntervalR, intersectionIntervalR);
});

const tests: Array<[Array<IntervalR>, IntervalR | null]> = [
    [
        [],
        null,
    ],
    [
        [
            [false, 0, 2, false],
            [true, 0, 3, true],
        ],
        [false, 0, 2, false],
    ],
    [
        [
            [false, 0, 3, false],
            [true, 0, 3, true],
        ],
        [false, 0, 3, false],
    ],
    [
        [
            [false, 0, 4, false],
            [true, 0, 3, true],
        ],
        [false, 0, 3, true],
    ],
    [
        [
            [false, 2, 4, false],
            [true, 0, 3, true],
        ],
        [false, 2, 3, true],
    ],
    [
        [
            [true, 3, 4, false],
            [true, 0, 3, true],
        ],
        [true, 3, 3, true],
    ],
    [
        [
            [false, 3, 4, false],
            [true, 0, 3, false],
        ],
        null,
    ],
];

for (const [list, expected] of tests) {
    test(`intersectionIntervalR(${list.map(stringifyIntervalR).join(', ')}) → ${expected ? stringifyIntervalR(expected) : expected}`, (t) => {
        t.deepEqual(intersectionIntervalR(...list), expected);
        t.deepEqual(intersectionIntervalR(...list.reverse()), expected);
    });
}

import test from 'ava';
import {unionIntervalR} from './union';
import {IntervalR} from './types';
import {stringifyIntervalR} from './stringify';

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
        [true, 0, 3, true],
    ],
    [
        [
            [false, 0, 3, false],
            [true, 0, 3, true],
        ],
        [true, 0, 3, true],
    ],
    [
        [
            [false, 0, 4, false],
            [true, 0, 3, true],
        ],
        [true, 0, 4, false],
    ],
    [
        [
            [false, 3, 4, false],
            [true, 0, 3, true],
        ],
        [true, 0, 4, false],
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
    test(`unionIntervalR(${list.map(stringifyIntervalR).join(', ')}) → ${expected ? stringifyIntervalR(expected) : expected}`, (t) => {
        t.deepEqual(unionIntervalR(...list), expected);
        t.deepEqual(unionIntervalR(...list.reverse()), expected);
    });
}

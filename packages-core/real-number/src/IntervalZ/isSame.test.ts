import test from 'ava';
import {isSameIntervalZ} from './isSame';
import {IntervalZ} from './types';
import {stringifyIntervalZ} from './stringify';

const tests: Array<[IntervalZ, IntervalZ, boolean]> = [
    [
        [0, 0],
        [0, 0],
        true,
    ],
    [
        [0, 0],
        [0, 1],
        false,
    ],
];

for (const [interval1, interval2, expected] of tests) {
    test(`isSameIntervalZ(${stringifyIntervalZ(interval1)}, ${stringifyIntervalZ(interval2)}) → ${expected}`, (t) => {
        t.is(isSameIntervalZ(interval1, interval2), expected);
    });
}

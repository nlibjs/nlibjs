import test from 'ava';
import {isSameSetZ} from './isSame';
import {SetZ} from './types';
import {stringifySetZ} from './stringify';
import * as index from './index';

test('index.isSameSetZ', (t) => {
    t.is(index.isSameSetZ, isSameSetZ);
});

const tests: Array<[SetZ, SetZ, boolean]> = [
    [
        [
            [0, 1],
            [3, 4],
        ],
        [
            [4, 4],
            [3, 4],
            [0, 1],
        ],
        true,
    ],
    [
        [
            [0, 1],
            [3, 4],
        ],
        [
            [5, 5],
            [3, 4],
            [0, 1],
        ],
        false,
    ],
];

for (const [interval1, interval2, expected] of tests) {
    test(`isSameSetZ(${stringifySetZ(interval1)}, ${stringifySetZ(interval2)}) → ${expected}`, (t) => {
        t.is(isSameSetZ(interval1, interval2), expected);
    });
}

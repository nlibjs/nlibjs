import test from 'ava';
import {normalizeSetZ} from './normalize';
import {SetZ} from './types';
import {stringifySetZ} from './stringify';

const tests: Array<[SetZ, SetZ]> = [
    [
        [
            [4, 5],
            [0, 2],
        ],
        [
            [0, 2],
            [4, 5],
        ],
    ],
    [
        [
            [3, 5],
            [0, 2],
        ],
        [
            [0, 5],
        ],
    ],
    [
        [
            [4, 5],
            [3, 4],
            [2, 3],
            [1, 2],
            [0, 1],
            [3, 3],
            [3, 3],
            [-1, 8],
            [10, 10],
        ],
        [
            [-1, 8],
            [10, 10],
        ],
    ],
];

for (const [input, expected] of tests) {
    test(`${stringifySetZ(input)} → ${stringifySetZ(expected)}`, (t) => {
        t.deepEqual(normalizeSetZ(input), expected);
    });
}

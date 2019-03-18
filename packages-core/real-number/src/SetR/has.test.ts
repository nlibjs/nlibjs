import test from 'ava';
import {hasSetR} from './has';
import {SetR} from './types';
import {stringifySetR} from './stringify';
import * as index from './index';

test('index.hasSetR', (t) => {
    t.is(index.hasSetR, hasSetR);
});

const tests: Array<[SetR, Array<[number, boolean]>]> = [
    [
        [
            [true, 4, 5, true],
            [true, 1, 2, true],
        ],
        [
            [0, false],
            [1, true],
            [2, true],
            [3, false],
            [4, true],
            [5, true],
            [6, false],
            [1.5, true],
            [4.5, true],
        ],
    ],
    [
        [
            [true, 4, 5, true],
            [false, 1, 2, true],
        ],
        [
            [0, false],
            [1, false],
            [2, true],
            [3, false],
            [4, true],
            [5, true],
            [6, false],
            [1.5, true],
            [4.5, true],
        ],
    ],
    [
        [
            [true, 4, 5, true],
            [false, 1, 2, false],
        ],
        [
            [0, false],
            [1, false],
            [2, false],
            [3, false],
            [4, true],
            [5, true],
            [6, false],
            [1.5, true],
            [4.5, true],
        ],
    ],
    [
        [
            [false, 4, 5, true],
            [false, 1, 2, false],
        ],
        [
            [0, false],
            [1, false],
            [2, false],
            [3, false],
            [4, false],
            [5, true],
            [6, false],
            [1.5, true],
            [4.5, true],
        ],
    ],
    [
        [
            [false, 4, 5, false],
            [false, 1, 2, false],
        ],
        [
            [0, false],
            [1, false],
            [2, false],
            [3, false],
            [4, false],
            [5, false],
            [6, false],
            [1.5, true],
            [4.5, true],
        ],
    ],
];

for (const [set, cases] of tests) {
    for (const [value, expected] of cases) {
        test(`has(${stringifySetR(set)}, ${value}) → ${expected}`, (t) => {
            t.is(hasSetR(set, value), expected);
        });
    }
}

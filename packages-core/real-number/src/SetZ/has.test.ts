import test from 'ava';
import {hasSetZ} from './has';
import {SetZ} from './types';
import {stringifySetZ} from './stringify';

const tests: Array<[SetZ, Array<[number, boolean]>]> = [
    [
        [
            [4, 5],
            [1, 2],
        ],
        [
            [0, false],
            [1, true],
            [1.5, false],
            [2, true],
            [3, false],
            [4, true],
            [4.5, false],
            [5, true],
            [6, false],
        ],
    ],
];

for (const [set, cases] of tests) {
    for (const [value, expected] of cases) {
        test(`has(${stringifySetZ(set)}, ${value}) → ${expected}`, (t) => {
            t.is(hasSetZ(set, value), expected);
        });
    }
}

import test from 'ava';
import {Infinity} from '@nlib/global';
import {complementSetZ} from './complement';
import {SetZ} from './types';
import {stringifySetZ} from './stringify';

const tests: Array<[SetZ, SetZ]> = [
    [
        [
        ],
        [
            [-Infinity, Infinity],
        ],
    ],
    [
        [
            [4, 5],
            [0, 2],
        ],
        [
            [-Infinity, -1],
            [3, 3],
            [6, Infinity],
        ],
    ],
];

for (const [input, expected] of tests) {
    test(`¬${stringifySetZ(input)} → ${stringifySetZ(expected)}`, (t) => {
        t.deepEqual(complementSetZ(input), expected);
    });
}

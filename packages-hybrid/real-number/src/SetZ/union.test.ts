import test from 'ava';
import {unionSetZ} from './union';
import {SetZ} from './types';
import {stringifySetZ} from './stringify';
import * as index from './index';

test('index.unionSetZ', (t) => {
    t.is(index.unionSetZ, unionSetZ);
});

const tests: Array<[Array<SetZ>, SetZ]> = [
    [
        [
            [
                [4, 5],
                [3, 4],
                [2, 3],
            ],
            [
                [1, 2],
                [0, 1],
                [3, 3],
            ],
        ],
        [
            [0, 5],
        ],
    ],
    [
        [
            [],
            [
                [0, 1],
                [2, 3],
            ],
            [
                [0, 10],
            ],
        ],
        [
            [0, 10],
        ],
    ],
];

for (const [input, expected] of tests) {
    test(`${input.map((set) => `${stringifySetZ(set)}`).join(' ∪ ')} → ${stringifySetZ(expected)}`, (t) => {
        t.deepEqual(unionSetZ(...input), expected);
    });
}

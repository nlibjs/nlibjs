import test from 'ava';
import {intersectionSetZ} from './intersection';
import {SetZ} from './types';
import {stringifySetZ} from './stringify';
import * as index from './index';

test('index.intersectionSetZ', (t) => {
    t.is(index.intersectionSetZ, intersectionSetZ);
});

const tests: Array<[Array<SetZ>, SetZ]> = [
    [
        [
            [
                [0, 3],
                [10, 20],
            ],
            [
                [2, 4],
                [12, 16],
            ],
            [
                [1, 5],
                [14, 18],
            ],
        ],
        [
            [2, 3],
            [14, 16],
        ],
    ],
    [
        [
            [
                [10, 20],
            ],
            [
                [12, 16],
            ],
            [
                [14, 18],
            ],
        ],
        [
            [14, 16],
        ],
    ],
];

for (const [input, expected] of tests) {
    test(`${input.map((set) => `${stringifySetZ(set)}`).join(' ∩ ')} → ${stringifySetZ(expected)}`, (t) => {
        t.deepEqual(intersectionSetZ(...input), expected);
    });
}

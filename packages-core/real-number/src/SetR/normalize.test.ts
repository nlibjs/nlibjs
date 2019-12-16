import test from 'ava';
import {normalizeSetR} from './normalize';
import {inin, inex, exin, exex} from '../IntervalR';
import {SetR} from './types';
import {stringifySetR} from './stringify';

const tests: Array<[SetR, SetR]> = [
    [
        [
            exex(1, 1),
            exin(3, 3),
            inex(5, 5),
        ],
        [
        ],
    ],
    [
        [
            exin(3, 5),
            inex(0, 3),
        ],
        [
            inex(0, 3),
            exin(3, 5),
        ],
    ],
    [
        [
            inin(4, 5),
            exex(3, 4),
            inex(2, 3),
            exin(1, 2),
            inin(0, 1),
            exex(3, 3),
        ],
        [
            inex(0, 3),
            exin(3, 5),
        ],
    ],
    [
        [
            inin(4, 5),
            exex(3, 4),
            inex(2, 3),
            exin(1, 2),
            inin(0, 1),
            inin(3, 3),
            exex(3, 3),
        ],
        [
            inin(0, 5),
        ],
    ],
    [
        [
            inin(4, 5),
            exex(3, 4),
            inex(2, 3),
            exin(1, 2),
            inin(0, 1),
            inin(3, 3),
            exex(3, 3),
            exex(-1, 8),
        ],
        [
            exex(-1, 8),
        ],
    ],
];

for (const [input, expected] of tests) {
    test(`${stringifySetR(input)} → ${stringifySetR(expected)}`, (t) => {
        t.deepEqual(normalizeSetR(input), expected);
    });
}

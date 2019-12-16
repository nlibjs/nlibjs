import test from 'ava';
import {intersectionSetR} from './intersection';
import {inin, inex, exin, exex} from '../IntervalR';
import {SetR} from './types';
import {stringifySetR} from './stringify';

const tests: Array<[Array<SetR>, SetR]> = [
    [
        [
            [
                inin(0, 3),
                inin(10, 20),
            ],
            [
                exex(2, 4),
                exex(12, 16),
            ],
            [
                inex(1, 5),
                inin(14, 18),
            ],
        ],
        [
            exin(2, 3),
            inex(14, 16),
        ],
    ],
    [
        [
            [
                inin(10, 20),
            ],
            [
                exex(12, 16),
            ],
            [
                inin(14, 18),
            ],
        ],
        [
            inex(14, 16),
        ],
    ],
];

for (const [input, expected] of tests) {
    test(`${input.map((set) => `${stringifySetR(set)}`).join(' ∩ ')} → ${stringifySetR(expected)}`, (t) => {
        t.deepEqual(intersectionSetR(...input), expected);
    });
}

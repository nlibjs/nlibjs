import test from 'ava';
import * as index from './index';
import {unionSetR} from './union';
import {inin, inex, exin, exex} from '../IntervalR';
import {SetR} from './types';
import {stringifySetR} from './stringify';

test('index.unionSetR', (t) => {
    t.is(index.unionSetR, unionSetR);
});

const tests: Array<[Array<SetR>, SetR]> = [
    [
        [
            [
                inin(4, 5),
                exex(3, 4),
                inex(2, 3),
            ],
            [
                exin(1, 2),
                inin(0, 1),
                exex(3, 3),
            ],
        ],
        [
            inex(0, 3),
            exin(3, 5),
        ],
    ],
    [
        [
            [],
            [
                inin(4, 5),
                exex(3, 4),
                inex(2, 3),
                exin(1, 2),
            ],
            [
                inin(0, 1),
                inin(3, 3),
                exex(3, 3),
            ],
        ],
        [
            inin(0, 5),
        ],
    ],
    [
        [
            [],
            [
                inin(0, 1),
                exex(2, 3),
            ],
            [
                exin(2, 4),
            ],
        ],
        [
            inin(0, 1),
            exin(2, 4),
        ],
    ],
];

for (const [input, expected] of tests) {
    test(`${input.map((set) => `${stringifySetR(set)}`).join(' ∪ ')} → ${stringifySetR(expected)}`, (t) => {
        t.deepEqual(unionSetR(...input), expected);
    });
}

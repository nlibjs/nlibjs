import test from 'ava';
import {Infinity} from '@nlib/global';
import {complementSetR} from './complement';
import {SetR} from './types';
import {stringifySetR} from './stringify';
import * as index from './index';
import {exex, inin, inex} from '../IntervalR';

test('index.complementSetR', (t) => {
    t.is(index.complementSetR, complementSetR);
});

const tests: Array<[SetR, SetR]> = [
    [
        [
        ],
        [
            exex(-Infinity, Infinity),
        ],
    ],
    [
        [
            inin(4, 5),
        ],
        [
            exex(-Infinity, 4),
            exex(5, Infinity),
        ],
    ],
    [
        [
            exex(5, 6),
            inex(4, 5),
        ],
        [
            exex(-Infinity, 4),
            inin(5, 5),
            inex(6, Infinity),
        ],
    ],
    [
        [
            exex(5, 6),
            inex(4, 5),
            exex(4.9, 5.1),
        ],
        [
            exex(-Infinity, 4),
            inex(6, Infinity),
        ],
    ],
];

for (const [input, expected] of tests) {
    test(`¬${stringifySetR(input)} → ${stringifySetR(expected)}`, (t) => {
        t.deepEqual(complementSetR(input), expected);
    });
}

import test from 'ava';
import {fromString} from '@nlib/infra';
import {IntervalZ} from '@nlib/real-number';
import {parseRepeat} from './Repeat';

const tests: Array<[string, number, IntervalZ, number]> = [
    [
        ' *foo',
        0,
        [1, 1],
        0,
    ],
    [
        ' *foo',
        1,
        [0, Infinity],
        2,
    ],
    [
        ' 2*foo',
        1,
        [2, Infinity],
        3,
    ],
    [
        ' *2foo',
        1,
        [0, 2],
        3,
    ],
    [
        ' 2*4foo',
        1,
        [2, 4],
        4,
    ],
];

for (const [input, from, expected, expectedEnd] of tests) {
    test(`${JSON.stringify(input)} (${from}) → ${JSON.stringify(expected)}`, (t) => {
        let position = from;
        const result = parseRepeat(
            fromString(input),
            position,
            (end) => {
                position = end;
            },
        );
        t.deepEqual(result, expected);
        t.is(position, expectedEnd);
    });
}

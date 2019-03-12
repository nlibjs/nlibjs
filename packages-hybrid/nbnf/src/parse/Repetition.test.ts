import test from 'ava';
import {fromString} from '@nlib/infra';
import {parseRepetition} from './Repetition';
import {NBNFElementType, INBNFRepetition} from '../types';
import * as index from './index';

test('index.parseRepetition', (t) => {
    t.is(index.parseRepetition, parseRepetition);
});

test('throw at SPACE', (t) => {
    t.throws(() => parseRepetition(fromString('  foo  '), 1, () => {}));
});

const tests: Array<[string, number, INBNFRepetition, number]> = [
    [
        '  foo  ',
        2,
        {repeat: [1, 1], element: {type: NBNFElementType.RuleName, data: 'foo'}},
        5,
    ],
    [
        '  0*1foo  ',
        2,
        {repeat: [0, 1], element: {type: NBNFElementType.RuleName, data: 'foo'}},
        8,
    ],
    [
        '  *foo  ',
        2,
        {repeat: [0, Infinity], element: {type: NBNFElementType.RuleName, data: 'foo'}},
        6,
    ],
    [
        '  1*foo  ',
        2,
        {repeat: [1, Infinity], element: {type: NBNFElementType.RuleName, data: 'foo'}},
        7,
    ],
    [
        '  2*3foo  ',
        2,
        {repeat: [2, 3], element: {type: NBNFElementType.RuleName, data: 'foo'}},
        8,
    ],
];

for (const [input, from, expected, expectedEnd] of tests) {
    test(`${JSON.stringify(input)} → ${JSON.stringify(expected)}`, (t) => {
        let position = from;
        const result = parseRepetition(
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

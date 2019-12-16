import test from 'ava';
import {fromString} from '@nlib/infra';
import {parseConcatenation} from './Concatenation';
import {INBNFConcatenation, NBNFElementType} from '../types/base';

const tests: Array<[string, number, INBNFConcatenation, number]> = [
    [
        ' foo ',
        1,
        [
            {repeat: [1, 1], element: {type: NBNFElementType.RuleName, data: 'foo'}},
        ],
        4,
    ],
    [
        ' 2*4foo ',
        1,
        [
            {repeat: [2, 4], element: {type: NBNFElementType.RuleName, data: 'foo'}},
        ],
        7,
    ],
    [
        ' 1*1foo ',
        1,
        [
            {repeat: [1, 1], element: {type: NBNFElementType.RuleName, data: 'foo'}},
        ],
        7,
    ],
    [
        ' 0*1foo ',
        1,
        [
            {repeat: [0, 1], element: {type: NBNFElementType.RuleName, data: 'foo'}},
        ],
        7,
    ],
];

for (const [input, from, expected, expectedEnd] of tests) {
    test(`${JSON.stringify(input)} → ${JSON.stringify(expected)}`, (t) => {
        let position = from;
        const result = parseConcatenation(
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

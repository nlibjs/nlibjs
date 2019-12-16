import test from 'ava';
import {fromString} from '@nlib/infra';
import {parseAlternation} from './Alternation';
import {INBNFAlternation, NBNFElementType} from '../types/base';

const tests: Array<[string, number, INBNFAlternation, number]> = [
    [
        ' foo bar ',
        1,
        [
            [
                {repeat: [1, 1], element: {type: NBNFElementType.RuleName, data: 'foo'}},
                {repeat: [1, 1], element: {type: NBNFElementType.RuleName, data: 'bar'}},
            ],
        ],
        8,
    ],
    [
        ' 2*4foo bar ',
        1,
        [
            [
                {repeat: [2, 4], element: {type: NBNFElementType.RuleName, data: 'foo'}},
                {repeat: [1, 1], element: {type: NBNFElementType.RuleName, data: 'bar'}},
            ],
        ],
        11,
    ],
    [
        ' 1*1foo bar ',
        1,
        [
            [
                {repeat: [1, 1], element: {type: NBNFElementType.RuleName, data: 'foo'}},
                {repeat: [1, 1], element: {type: NBNFElementType.RuleName, data: 'bar'}},
            ],
        ],
        11,
    ],
    [
        ' 0*1foo ',
        1,
        [
            [
                {repeat: [0, 1], element: {type: NBNFElementType.RuleName, data: 'foo'}},
            ],
        ],
        7,
    ],
];

for (const [input, from, expected, expectedEnd] of tests) {
    test(`${JSON.stringify(input)} → ${JSON.stringify(expected)}`, (t) => {
        let position = from;
        const result = parseAlternation(
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

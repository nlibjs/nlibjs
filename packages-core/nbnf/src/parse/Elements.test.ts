import test from 'ava';
import {fromString} from '@nlib/infra';
import {parseElements} from './Elements';
import {NBNFElementType, INBNFAlternation} from '../types';
import * as index from './index';

test('index.parseElements', (t) => {
    t.is(index.parseElements, parseElements);
});

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
        9,
    ],
    [
        ' 2*4foo 1*1bar  ',
        1,
        [
            [
                {repeat: [2, 4], element: {type: NBNFElementType.RuleName, data: 'foo'}},
                {repeat: [1, 1], element: {type: NBNFElementType.RuleName, data: 'bar'}},
            ],
        ],
        16,
    ],
    [
        ' 0*1foo *1bar  2*baz ',
        1,
        [
            [
                {repeat: [0, 1], element: {type: NBNFElementType.RuleName, data: 'foo'}},
                {repeat: [0, 1], element: {type: NBNFElementType.RuleName, data: 'bar'}},
                {repeat: [2, Infinity], element: {type: NBNFElementType.RuleName, data: 'baz'}},
            ],
        ],
        21,
    ],
];

for (const [input, from, expected, expectedEnd] of tests) {
    test(`${JSON.stringify(input)} → ${JSON.stringify(expected)}`, (t) => {
        let position = from;
        const result = parseElements(fromString(input), position, (end) => {
            position = end;
        });
        t.deepEqual(result, expected);
        t.is(position, expectedEnd);
    });
}

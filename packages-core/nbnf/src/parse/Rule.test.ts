import test from 'ava';
import {fromString} from '@nlib/infra';
import {parseRule} from './Rule';
import {NBNFElementType, INBNFRule} from '../types';
import * as index from './index';

test('index.parseRule', (t) => {
    t.is(index.parseRule, parseRule);
});

test('throw at SPACE', (t) => {
    t.throws(() => parseRule(fromString(' foo = bar baz \n\n'), 0, () => {}));
});

test('throw by missing =', (t) => {
    t.throws(() => parseRule(fromString(' foo bar baz \n\n'), 1, () => {}));
});

const tests: Array<[string, number, INBNFRule, number]> = [
    [
        ' foo = bar 2*4baz / *ban \n\n',
        1,
        {
            name: 'foo',
            incremental: false,
            elements: [
                [
                    {repeat: [1, 1], element: {type: NBNFElementType.RuleName, data: 'bar'}},
                    {repeat: [2, 4], element: {type: NBNFElementType.RuleName, data: 'baz'}},
                ],
                [
                    {repeat: [0, Infinity], element: {type: NBNFElementType.RuleName, data: 'ban'}},
                ],
            ],
        },
        26,
    ],
    [
        ' <foo> =/ bar 2*4baz \n\n',
        1,
        {
            name: '<foo>',
            incremental: true,
            elements: [
                [
                    {repeat: [1, 1], element: {type: NBNFElementType.RuleName, data: 'bar'}},
                    {repeat: [2, 4], element: {type: NBNFElementType.RuleName, data: 'baz'}},
                ],
            ],
        },
        22,
    ],
];

for (const [input, from, expected, expectedEnd] of tests) {
    test(`${JSON.stringify(input)} → ${JSON.stringify(expected)}`, (t) => {
        let position = from;
        const result = parseRule(fromString(input), position, (end) => {
            position = end;
        });
        t.deepEqual(result, expected);
        t.is(position, expectedEnd);
    });
}

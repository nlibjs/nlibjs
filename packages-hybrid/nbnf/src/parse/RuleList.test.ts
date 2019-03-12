import test from 'ava';
import {fromString} from '@nlib/infra';
import {parseRuleList} from './RuleList';
import * as index from './index';
import {INBNFRuleList, NBNFElementType} from '../types';

test('index.parseRuleList', (t) => {
    t.is(index.parseRuleList, parseRuleList);
});

interface ITest {
    lines: Array<string>,
    from: number,
    expected: INBNFRuleList,
    expectedEnd: number,
}

([
    {
        lines: [
            ' foo = bar',
            ' / 2*4%i"AbC"',
            'bar = 5"baz" ',
            '',
            '',
        ],
        from: 1,
        expected: {
            foo: [
                [
                    {
                        repeat: [1, 1],
                        element: {
                            type: NBNFElementType.RuleName,
                            data: 'bar',
                        },
                    },
                ],
                [
                    {
                        repeat: [2, 4],
                        element: {
                            type: NBNFElementType.Sequence,
                            data: fromString('AbC'),
                            caseSensitive: false,
                        },
                    },
                ],
            ],
            bar: [
                [
                    {
                        repeat: [5, 5],
                        element: {
                            type: NBNFElementType.Sequence,
                            data: fromString('baz'),
                            caseSensitive: true,
                        },
                    },
                ],
            ],
        },
        expectedEnd: 40,
    },
    {
        lines: [
            '',
            ' ;foo',
            '',
            ' ;foo',
            ' ;foo',
            ' ;foo',
            'foo = bar',
            '',
            'bar = 5%i"baz" ',
            'foo =/ 2*4"AbC"',
            '',
            '',
        ],
        from: 0,
        expected: {
            foo: [
                [
                    {
                        repeat: [1, 1],
                        element: {
                            type: NBNFElementType.RuleName,
                            data: 'bar',
                        },
                    },
                ],
                [
                    {
                        repeat: [2, 4],
                        element: {
                            type: NBNFElementType.Sequence,
                            data: fromString('AbC'),
                            caseSensitive: true,
                        },
                    },
                ],
            ],
            bar: [
                [
                    {
                        repeat: [5, 5],
                        element: {
                            type: NBNFElementType.Sequence,
                            data: fromString('baz'),
                            caseSensitive: false,
                        },
                    },
                ],
            ],
        },
        expectedEnd: 70,
    },
] as Array<ITest>).forEach(({lines, from, expected, expectedEnd}) => {
    test(lines.join('\\n'), (t) => {
        let position = from;
        const actual = parseRuleList(
            fromString(lines.join('\n')),
            position,
            (end) => {
                position = end;
            },
        );
        t.deepEqual(actual, expected);
        t.is(position, expectedEnd);
    });
});

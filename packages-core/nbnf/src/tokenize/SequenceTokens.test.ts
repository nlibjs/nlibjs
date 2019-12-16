import test from 'ava';
import {fromString} from '@nlib/infra';
import {IntervalZ} from '@nlib/real-number';
import {collectSequenceTokens} from './SequenceTokens';
import {tokenizerResultToDebugString} from '../util';
import {INBNFCompiledSequenceElement, NBNFCompiledElementType} from '../types/compiled';
import {INBNFTokenizerResult} from '../types/misc';

interface ITest {
    repeat: IntervalZ,
    element: INBNFCompiledSequenceElement,
    cases: Array<{
        input: string,
        from: number,
        expected: Array<INBNFTokenizerResult>,
        expectedEnd: number,
    }>,
}

([
    {
        repeat: [1, 3],
        element: {
            type: NBNFCompiledElementType.Sequence,
            data: fromString('abc'),
            caseSensitive: true,
        },
        cases: [
            {
                input: 'abc',
                from: 0,
                expected: [
                    {
                        nodes: [...fromString('abc')],
                        end: 3,
                    },
                ],
            },
            {
                input: 'abcd',
                from: 0,
                expected: [
                    {
                        nodes: [...fromString('abc')],
                        end: 3,
                    },
                ],
            },
            {
                input: 'aabce',
                from: 1,
                expected: [
                    {
                        nodes: [...fromString('abc')],
                        end: 4,
                    },
                ],
            },
            {
                input: 'aaa',
                from: 1,
                expected: [],
            },
            {
                input: 'aabcabce',
                from: 1,
                expected: [
                    {
                        nodes: [...fromString('abcabc')],
                        end: 7,
                    },
                    {
                        nodes: [...fromString('abc')],
                        end: 4,
                    },
                ],
            },
            {
                input: 'aabcabcabce',
                from: 1,
                expected: [
                    {
                        nodes: [...fromString('abcabcabc')],
                        end: 10,
                    },
                    {
                        nodes: [...fromString('abcabc')],
                        end: 7,
                    },
                    {
                        nodes: [...fromString('abc')],
                        end: 4,
                    },
                ],
            },
        ],
    },
    {
        repeat: [1, 3],
        element: {
            type: NBNFCompiledElementType.Sequence,
            data: fromString('abc'),
            caseSensitive: false,
        },
        cases: [
            {
                input: 'abc',
                from: 0,
                expected: [
                    {
                        nodes: [...fromString('abc')],
                        end: 3,
                    },
                ],
            },
            {
                input: 'aBc',
                from: 0,
                expected: [
                    {
                        nodes: [...fromString('aBc')],
                        end: 3,
                    },
                ],
            },
        ],
    },
] as Array<ITest>).forEach(
    ({repeat, element, cases}, index1) => {
        cases.forEach(({input, from, expected}, index2) => {
            test(`#${index1}.${index2} ${JSON.stringify(input)} (${from}) → ${expected.map(tokenizerResultToDebugString).join('|')}`, (t) => {
                const actual = [...collectSequenceTokens(
                    repeat,
                    element,
                    fromString(input),
                    from,
                )];
                t.deepEqual(actual, expected);
            });
        });
    },
);

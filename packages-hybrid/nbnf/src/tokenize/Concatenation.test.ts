import test from 'ava';
import {
    fromString,
} from '@nlib/infra';
import {tokenizeConcatenation} from './Concatenation';
import {
    NBNFCompiledElementType,
    INBNFCompiledConcatenation,
    INBNFTokenizerResult,
} from '../types';
import * as index from './index';
import {tokenizerResultToDebugString} from '../util';

test('index.tokenizeConcatenation', (t) => {
    t.is(index.tokenizeConcatenation, tokenizeConcatenation);
});

interface ITest {
    concatenation: INBNFCompiledConcatenation,
    cases: Array<{
        input: string,
        from: number,
        expected: Array<INBNFTokenizerResult>,
    }>,
}

([
    {
        concatenation: [
            {
                repeat: [0, 1],
                element: {
                    type: NBNFCompiledElementType.CodePoint,
                    data: [[0x61, 0x62]],
                },
            },
            {
                repeat: [1, 1],
                element: {
                    type: NBNFCompiledElementType.CodePoint,
                    data: [[0x61, 0x61]],
                },
            },
        ],
        cases: [
            {
                input: 'a',
                from: 0,
                expected: [
                    {nodes: [...fromString('a')], end: 1},
                ],
            },
            {
                input: 'aa',
                from: 0,
                expected: [
                    {nodes: [...fromString('aa')], end: 2},
                    {nodes: [...fromString('a')], end: 1},
                ],
            },
        ],
    },
    {
        concatenation: [
            {
                repeat: [0, 2],
                element: {
                    type: NBNFCompiledElementType.Sequence,
                    data: fromString('abc'),
                },
            },
            {
                repeat: [0, 2],
                element: {
                    type: NBNFCompiledElementType.Sequence,
                    data: fromString('xyz'),
                },
            },
            {
                repeat: [2, 10],
                element: {
                    type: NBNFCompiledElementType.CodePoint,
                    data: [[0x78, 0x7a]],
                },
            },
        ],
        cases: [
            {
                input: 'abcabcxyzxyzxyz',
                from: 0,
                expected: [
                    {nodes: [...fromString('abcabcxyzxyzxyz')], end: 15},
                    {nodes: [...fromString('abcabcxyzxyzxy')], end: 14},
                    {nodes: [...fromString('abcabcxyzxyzxyz')], end: 15},
                    {nodes: [...fromString('abcabcxyzxyzxy')], end: 14},
                    {nodes: [...fromString('abcabcxyzxyzx')], end: 13},
                    {nodes: [...fromString('abcabcxyzxyz')], end: 12},
                    {nodes: [...fromString('abcabcxyzxy')], end: 11},
                    {nodes: [...fromString('abcabcxyzxyzxyz')], end: 15},
                    {nodes: [...fromString('abcabcxyzxyzxy')], end: 14},
                    {nodes: [...fromString('abcabcxyzxyzx')], end: 13},
                    {nodes: [...fromString('abcabcxyzxyz')], end: 12},
                    {nodes: [...fromString('abcabcxyzxy')], end: 11},
                    {nodes: [...fromString('abcabcxyzx')], end: 10},
                    {nodes: [...fromString('abcabcxyz')], end: 9},
                    {nodes: [...fromString('abcabcxy')], end: 8},
                ],
            },
        ],
    },
    {
        concatenation: [
            {
                repeat: [0, 1],
                element: {
                    type: NBNFCompiledElementType.Group,
                    data: [
                        [
                            {
                                repeat: [0, 1],
                                element: {
                                    type: NBNFCompiledElementType.CodePoint,
                                    data: [[0x41, 0x42]],
                                },
                            },
                            {
                                repeat: [1, 1],
                                element: {
                                    type: NBNFCompiledElementType.CodePoint,
                                    data: [[0x42, 0x42]],
                                },
                            },
                        ],
                    ],
                },
            },
        ],
        cases: [
            {
                input: 'BB',
                from: 0,
                expected: [
                    {nodes: [...fromString('BB')], end: 2},
                    {nodes: [...fromString('B')], end: 1},
                    {nodes: [], end: 0},
                ],
            },
        ],
    },
] as Array<ITest>).forEach(
    ({concatenation, cases}, index1) => {
        cases.forEach(({input, from, expected}, index2) => {
            test(`#${index1}.${index2} ${JSON.stringify(input)} (${from}) → ${expected.map(tokenizerResultToDebugString).join('|')}`, (t) => {
                const actual = [...tokenizeConcatenation(
                    concatenation,
                    fromString(input),
                    from,
                )];
                // t.log(JSON.stringify(actual, null, 2));
                t.deepEqual(actual, expected);
            });
        });
    },
);

import test from 'ava';
import {
    fromString,
    FULL_STOP,
    LATIN_CAPITAL_LETTER_A,
} from '@nlib/infra';
import {tokenizeRepetition} from './Repetition';
import {tokenizerResultToDebugString} from '../util';
import {INBNFCompiledRepetition, NBNFCompiledElementType} from '../types/compiled';
import {INBNFTokenizerResult} from '../types/misc';

interface ITest {
    repetition: INBNFCompiledRepetition,
    cases: Array<{
        input: string,
        from: number,
        expected: Array<INBNFTokenizerResult>,
    }>,
}

([
    {
        repetition: {
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
    {
        repetition: {
            repeat: [0, Infinity],
            element: {
                type: NBNFCompiledElementType.Group,
                data: [
                    [
                        {
                            repeat: [1, 1],
                            element: {
                                type: NBNFCompiledElementType.CodePoint,
                                data: [[FULL_STOP, FULL_STOP]],
                            },
                        },
                        {
                            repeat: [1, Infinity],
                            element: {
                                type: NBNFCompiledElementType.CodePoint,
                                data: [[LATIN_CAPITAL_LETTER_A, LATIN_CAPITAL_LETTER_A]],
                            },
                        },
                    ],
                ],
            },
        },
        cases: [
            {
                input: '.AA.AA',
                from: 0,
                expected: [
                    {nodes: [...fromString('.AA.AA')], end: 6},
                    {nodes: [...fromString('.AA.A')], end: 5},
                    {nodes: [...fromString('.AA')], end: 3},
                    {nodes: [...fromString('.A')], end: 2},
                    {nodes: [], end: 0},
                ],
            },
        ],
    },
] as Array<ITest>).forEach(
    ({repetition, cases}, index1) => {
        cases.forEach(({input, from, expected}, index2) => {
            test(`#${index1}.${index2} ${JSON.stringify(input)} (${from}) → ${expected.map(tokenizerResultToDebugString).join('|')}`, (t) => {
                const actual = [...tokenizeRepetition(
                    repetition,
                    fromString(input),
                    from,
                )];
                // t.log(JSON.stringify(actual, null, 2));
                t.deepEqual(actual, expected);
            });
        });
    },
);

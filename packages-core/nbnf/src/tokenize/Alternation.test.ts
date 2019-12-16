import test from 'ava';
import {fromString} from '@nlib/infra';
import {tokenizeAlternation} from './Alternation';
import {tokenizerResultToDebugString} from '../util';
import {INBNFCompiledAlternation, NBNFCompiledElementType} from '../types/compiled';
import {INBNFTokenizerResult} from '../types/misc';

interface ITest {
    alternation: INBNFCompiledAlternation,
    cases: Array<{
        input: string,
        from: number,
        expected: Array<INBNFTokenizerResult>,
    }>,
}

([
    {
        alternation: [
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
                        data: [[0x41, 0x41]],
                    },
                },
            ],
        ],
        cases: [
            {
                input: 'AA',
                from: 0,
                expected: [
                    {nodes: [...fromString('AA')], end: 2},
                    {nodes: [...fromString('A')], end: 1},
                ],
            },
        ],
    },
    {
        alternation: [
            [
                {
                    repeat: [0, Infinity],
                    element: {
                        type: NBNFCompiledElementType.CodePoint,
                        data: [[0x00, 0x43], [0x45, 0xFFFFFFFF]],
                    },
                },
            ],
        ],
        cases: [
            {
                input: 'ABCDE',
                from: 0,
                expected: [
                    {nodes: [...fromString('ABC')], end: 3},
                    {nodes: [...fromString('AB')], end: 2},
                    {nodes: [...fromString('A')], end: 1},
                    {nodes: [...fromString('')], end: 0},
                ],
            },
        ],
    },
] as Array<ITest>).forEach(
    ({alternation, cases}, index1) => {
        cases.forEach(({input, from, expected}, index2) => {
            test(`#${index1}.${index2} ${JSON.stringify(input)} (${from}) → ${expected.map(tokenizerResultToDebugString).join('|')}`, (t) => {
                const actual = [...tokenizeAlternation(
                    alternation,
                    fromString(input),
                    from,
                )];
                // t.log(JSON.stringify(actual, null, 2));
                t.deepEqual(actual, expected);
            });
        });
    },
);

import test from 'ava';
import {fromString} from '@nlib/infra';
import {tokenizeAlternation} from './Alternation';
import {
    NBNFCompiledElementType,
    INBNFCompiledAlternation,
    INBNFTokenizerResult,
} from '../types';
import * as index from './index';
import {tokenizerResultToDebugString} from '../util';

test('index.tokenizeAlternation', (t) => {
    t.is(index.tokenizeAlternation, tokenizeAlternation);
});

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

import test from 'ava';
import {fromString} from '@nlib/infra';
import {IntervalZ} from '@nlib/real-number';
import {collectCodePointTokens} from './CodePointTokens';
import {
    NBNFCompiledElementType,
    INBNFCompiledCodePointElement,
    INBNFTokenizerResult,
} from '../types';
import * as index from './index';
import {tokenizerResultToDebugString} from '../util';

test('index.collectCodePointTokens', (t) => {
    t.is(index.collectCodePointTokens, collectCodePointTokens);
});

interface ITest {
    repeat: IntervalZ,
    element: INBNFCompiledCodePointElement,
    cases: Array<{
        input: string,
        from: number,
        expected: Array<INBNFTokenizerResult>,
    }>,
}

([
    {
        repeat: [2, 4],
        element: {
            type: NBNFCompiledElementType.CodePoint,
            data: [[0x61, 0x64]],
        },
        cases: [
            {
                input: 'abc',
                from: 0,
                expected: [
                    {nodes: [...fromString('abc')], end: 3},
                    {nodes: [...fromString('ab')], end: 2},
                ],
            },
            {
                input: 'abcd',
                from: 0,
                expected: [
                    {nodes: [...fromString('abcd')], end: 4},
                    {nodes: [...fromString('abc')], end: 3},
                    {nodes: [...fromString('ab')], end: 2},
                ],
            },
            {
                input: 'abcae',
                from: 1,
                expected: [
                    {nodes: [...fromString('bca')], end: 4},
                    {nodes: [...fromString('bc')], end: 3},
                ],
            },
        ],
    },
] as Array<ITest>).forEach(
    ({repeat, element, cases}, index1) => {
        cases.forEach(({input, from, expected}, index2) => {
            test(`#${index1}.${index2} ${JSON.stringify(input)} (${from}) → ${expected.map(tokenizerResultToDebugString).join('|')}`, (t) => {
                const actual = [...collectCodePointTokens(
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

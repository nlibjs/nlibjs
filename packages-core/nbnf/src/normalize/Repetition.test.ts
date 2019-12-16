import test from 'ava';
import {fromString} from '@nlib/infra';
import {normalizeRepetition} from './Repetition';
import {parseRepetition} from '../parse/Repetition';
import {INBNFNormalizedRuleList, NBNFNormalizedElementType} from '../types/normalized';

const tests: Array<[string, string, INBNFNormalizedRuleList?]> = [
    [
        'foo',
        '0*1"bar"',
        {
            foo: [
                [{repeat: [0, 1], element: {type: NBNFNormalizedElementType.Sequence, data: fromString('bar'), caseSensitive: true}}],
            ],
        },
    ],
    [
        '(foo)',
        '0*1"bar"',
        {
            foo: [
                [{repeat: [0, 1], element: {type: NBNFNormalizedElementType.Sequence, data: fromString('bar'), caseSensitive: true}}],
            ],
        },
    ],
    [
        '%x41-41',
        '"A"',
    ],
    [
        '(foo)',
        '1*1foo',
    ],
    [
        '[foo]',
        '0*1foo',
    ],
    [
        '[([(foo)])]',
        '0*1foo',
    ],
    [
        '3*4[foo]',
        '0*4foo',
    ],
];

for (const [source, expected, expands = {}] of tests) {
    test(`${source} → ${expected}`, (t) => {
        const repetition = parseRepetition(fromString(source), 0, () => {});
        const normalizedRepetition = normalizeRepetition(repetition, expands);
        const expectedRepetition = normalizeRepetition(parseRepetition(fromString(expected), 0, () => {}), {});
        t.deepEqual(normalizedRepetition, expectedRepetition);
    });
}

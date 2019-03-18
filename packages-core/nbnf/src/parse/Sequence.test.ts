import test from 'ava';
import {JSON} from '@nlib/global';
import {fromString} from '@nlib/infra';
import {parseSequence} from './Sequence';
import * as index from './index';
import {NBNFElementType, INBNFSequenceElement} from '../types';

test('index.parseSequence', (t) => {
    t.is(index.parseSequence, parseSequence);
});

test('throws at SPACE', (t) => {
    t.throws(() => parseSequence(fromString('  "" '), 1, () => {}, false));
});

test('empty', (t) => {
    t.throws(() => parseSequence(fromString('  "" '), 2, () => {}, false));
});

test('unterminated', (t) => {
    t.throws(() => parseSequence(fromString('  "foo'), 2, () => {}, false));
});

interface ITest {
    input: string,
    from: number,
    caseSensitive: boolean,
    expected: INBNFSequenceElement,
    expectedEnd: number,
}

([
    {
        input: '  "foo" ',
        from: 2,
        caseSensitive: true,
        expected: {
            type: NBNFElementType.Sequence,
            data: fromString('foo'),
            caseSensitive: true,
        },
        expectedEnd: 7,
    },
    {
        input: '  "foo bar\n\tbaz" ',
        from: 2,
        caseSensitive: false,
        expected: {
            type: NBNFElementType.Sequence,
            data: fromString('foo bar\n\tbaz'),
            caseSensitive: false,
        },
        expectedEnd: 16,
    },
] as Array<ITest>).forEach(({input, from, caseSensitive, expected, expectedEnd}) => {
    test(`${JSON.stringify(input)} → ${JSON.stringify(expected)}`, (t) => {
        let position = from;
        const result = parseSequence(
            fromString(input),
            position,
            (end) => {
                position = end;
            },
            caseSensitive,
        );
        t.deepEqual(result, expected);
        t.is(position, expectedEnd);
    });
});

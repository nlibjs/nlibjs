import test from 'ava';
import {
    fromString,
    fromIterable,
} from '@nlib/infra';
import {parseNumVal} from './NumVal';
import {
    NBNFElementType,
    INBNFCodePointElement,
    INBNFSequenceElement,
} from '../types';
import * as index from './index';

test('index.parseNumVal', (t) => {
    t.is(index.parseNumVal, parseNumVal);
});

test('throw at SPACE', (t) => {
    t.throws(() => parseNumVal(fromString('  '), 1, () => {}));
});

test('throw at invalid radix', (t) => {
    t.throws(() => parseNumVal(fromString('  %_10101'), 2, () => {}));
});

interface ITest {
    input: string,
    from: number,
    expected: INBNFSequenceElement | INBNFCodePointElement,
    expectedEnd: number,
}

([
    {
        input: '  %b1000001',
        from: 2,
        expected: {type: NBNFElementType.Sequence, data: fromIterable([0b1000001]), caseSensitive: true},
        expectedEnd: 11,
    },
    {
        input: '  %b1000001.1000010.1000011',
        from: 2,
        expected: {type: NBNFElementType.Sequence, data: fromIterable([0b1000001, 0b1000010, 0b1000011]), caseSensitive: true},
        expectedEnd: 27,
    },
    {
        input: '  %b1000001-1000011',
        from: 2,
        expected: {type: NBNFElementType.CodePoint, data: [[0b1000001, 0b1000011]]},
        expectedEnd: 19,
    },
    {
        input: '  %d65',
        from: 2,
        expected: {type: NBNFElementType.Sequence, data: fromIterable([65]), caseSensitive: true},
        expectedEnd: 6,
    },
    {
        input: '  %x41.42.43',
        from: 2,
        expected: {type: NBNFElementType.Sequence, data: fromIterable([0x41, 0x42, 0x43]), caseSensitive: true},
        expectedEnd: 12,
    },
    {
        input: '  %x41-43',
        from: 2,
        expected: {type: NBNFElementType.CodePoint, data: [[0x41, 0x43]]},
        expectedEnd: 9,
    },
] as Array<ITest>).forEach(({input, from, expected, expectedEnd}) => {
    test(`${JSON.stringify(input)} → ${JSON.stringify(expected)}`, (t) => {
        let position = from;
        const result = parseNumVal(
            fromString(input),
            position,
            (end) => {
                position = end;
            },
        );
        t.deepEqual(result, expected);
        t.is(position, expectedEnd);
    });
});

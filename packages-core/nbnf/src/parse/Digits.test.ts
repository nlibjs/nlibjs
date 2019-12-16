import {parseInt} from '@nlib/global';
import {
    fromString,
    LATIN_SMALL_LETTER_B,
    LATIN_SMALL_LETTER_D,
    LATIN_SMALL_LETTER_X,
} from '@nlib/infra';
import test from 'ava';
import {
    parseDigits,
    radixes,
    IRadixData,
    RadixBin,
    RadixDec,
    RadixHex,
} from './Digits';

test(`radixes[${LATIN_SMALL_LETTER_B}]`, (t) => {
    t.is(radixes[LATIN_SMALL_LETTER_B], RadixBin);
});

test(`radixes[${LATIN_SMALL_LETTER_D}]`, (t) => {
    t.is(radixes[LATIN_SMALL_LETTER_D], RadixDec);
});

test(`radixes[${LATIN_SMALL_LETTER_X}]`, (t) => {
    t.is(radixes[LATIN_SMALL_LETTER_X], RadixHex);
});

test('throw at SPACE', (t) => {
    t.throws(() => parseDigits(fromString('  1'), 1, RadixBin, () => {}));
});

const tests: Array<[string, number, IRadixData, number, number]> = [
    [
        '  10101',
        2,
        RadixBin,
        0b10101,
        7,
    ],
    [
        '  13579a',
        2,
        RadixDec,
        parseInt('13579', 10),
        7,
    ],
    [
        '  147ADG',
        2,
        RadixHex,
        0x147AD,
        7,
    ],
];

for (const [input, from, radix, expected, expectedEnd] of tests) {
    test(`${JSON.stringify(input)} → ${JSON.stringify(expected)}`, (t) => {
        let position = from;
        const result = parseDigits(
            fromString(input),
            position,
            radix,
            (end) => {
                position = end;
            },
        );
        t.deepEqual(result, expected);
        t.is(position, expectedEnd);
    });
}

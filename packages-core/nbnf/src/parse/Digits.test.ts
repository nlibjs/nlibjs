import {parseInt} from '@nlib/global';
import {
    fromString,
    LATIN_SMALL_LETTER_B,
    LATIN_SMALL_LETTER_D,
    LATIN_SMALL_LETTER_X,
} from '@nlib/infra';
import test from 'ava';
import {parseDigits, radixes, IRadixData} from './Digits';
import * as index from './index';

test('index.parseDigits', (t) => {
    t.is(index.parseDigits, parseDigits);
});

const {
    [LATIN_SMALL_LETTER_B]: bin,
    [LATIN_SMALL_LETTER_D]: dec,
    [LATIN_SMALL_LETTER_X]: hex,
} = radixes;

test('throw at SPACE', (t) => {
    t.throws(() => parseDigits(fromString('  1'), 1, bin, () => {}));
});

const tests: Array<[string, number, IRadixData, number, number]> = [
    [
        '  10101',
        2,
        bin,
        0b10101,
        7,
    ],
    [
        '  13579a',
        2,
        dec,
        parseInt('13579', 10),
        7,
    ],
    [
        '  147ADG',
        2,
        hex,
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

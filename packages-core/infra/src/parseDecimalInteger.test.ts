import test from 'ava';
import {parseDecimalInteger} from './parseDecimalInteger';
import {fromString} from './4.6.Strings';

const tests: Array<[string, number, number, number]> = [
    ['  0  ', 2, 0, 3],
    ['  1  ', 2, 1, 3],
    ['  123  ', 2, 123, 5],
];

for (const [source, from, expected, expectedEnd] of tests) {
    test(`parseDecimalInteger("${source}", ${from}) → ${expected} (${expectedEnd})`, (t) => {
        let position = from;
        const result = parseDecimalInteger(fromString(source), position, (newPosition) => {
            position = newPosition;
        });
        t.is(result, expected);
        t.is(position, expectedEnd);
    });
}

const errorTests: Array<[string, number]> = [
    ['  00123  ', 0],
];

for (const [source, from] of errorTests) {
    test(`parseDecimalInteger("${source}", ${from}) should throw an error`, (t) => {
        t.throws(() => parseDecimalInteger(fromString(source), from));
    });
}

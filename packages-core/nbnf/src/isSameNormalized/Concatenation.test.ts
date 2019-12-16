import test from 'ava';
import {fromString} from '@nlib/infra';
import {isSameNormalizedConcatenation} from './Concatenation';
import {normalizeConcatenation} from '../normalize/Concatenation';
import {parseConcatenation} from '../parse/Concatenation';

const tests: Array<[string, string, boolean]> = [
    ['foo bar', 'foo bar', true],
    ['foo bar', 'foo baz', false],
    ['foo bar', 'foo', false],
];

for (const [concatenation1, concatenation2, expected] of tests) {
    test(`isSameNormalizedConcatenation(${concatenation1}, ${concatenation2}) → ${expected}`, (t) => {
        t.is(
            isSameNormalizedConcatenation(
                normalizeConcatenation(parseConcatenation(fromString(concatenation1), 0, () => {}), {}),
                normalizeConcatenation(parseConcatenation(fromString(concatenation2), 0, () => {}), {}),
            ),
            expected,
        );
    });
}

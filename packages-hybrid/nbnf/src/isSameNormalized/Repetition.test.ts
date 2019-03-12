import test from 'ava';
import {isSameNormalizedRepetition} from './Repetition';
import {parseRepetition} from '../parse';
import {fromString} from '@nlib/infra';
import {normalizeRepetition} from '../normalize';

const tests: Array<[string, string, boolean]> = [
    ['foo', 'foo', true],
    ['foo', '1*1foo', true],
    ['foo', '0*1foo', false],
    ['foo', '"foo"', false],
    ['foo', 'bar', false],
    ['"foo"', '"foo"', true],
    ['"foo"', '"bar"', false],
    ['(foo)', '(foo)', true],
    ['(foo)', '(bar)', false],
    ['[foo]', '[foo]', true],
    ['[foo]', '[bar]', false],
    ['%x41.42.43', '%x41.42.43', true],
    ['%x41.42.43', '%x41.42.63', false],
    ['%x41-43', '%x41-43', true],
    ['%x41-43', '%x41-63', false],
];

for (const [repetition1, repetition2, expected] of tests) {
    test(`isSameNormalizedRepetition(${repetition1}, ${repetition2}) → ${expected}`, (t) => {
        t.is(
            isSameNormalizedRepetition(
                normalizeRepetition(parseRepetition(fromString(repetition1), 0, () => {}), {}),
                normalizeRepetition(parseRepetition(fromString(repetition2), 0, () => {}), {}),
            ),
            expected,
        );
    });
}

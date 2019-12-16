import test from 'ava';
import {fromString} from '@nlib/infra';
import {isSameNormalizedAlternation} from './Alternation';
import {normalizeAlternation} from '../normalize/Alternation';
import {parseAlternation} from '../parse/Alternation';

const tests: Array<[string, string, boolean]> = [
    ['foo / bar', 'foo / bar', true],
    ['foo / bar', 'foo / baz', false],
    ['foo / bar', 'foo', false],
];

for (const [alternation1, alternation2, expected] of tests) {
    test(`isSameNormalizedAlternation(${alternation1}, ${alternation2}) → ${expected}`, (t) => {
        t.is(
            isSameNormalizedAlternation(
                normalizeAlternation(parseAlternation(fromString(alternation1), 0, () => {}), {}),
                normalizeAlternation(parseAlternation(fromString(alternation2), 0, () => {}), {}),
            ),
            expected,
        );
    });
}

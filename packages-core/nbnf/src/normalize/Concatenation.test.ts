import test from 'ava';
import {fromString} from '@nlib/infra';
import {normalizeConcatenation} from './Concatenation';
import {parseConcatenation} from '../parse/Concatenation';

const tests: Array<[string, string]> = [
    [
        '(foo) (foo)',
        '2*2foo',
    ],
    [
        '(foo) [foo] (foo) [foo]',
        '2*4foo',
    ],
    [
        '(foo bar) (foo bar)',
        '2*2(foo bar)',
    ],
    [
        '(foo bar) (foo bar) [foo bar]',
        '2*3(foo bar)',
    ],
    [
        '(foo bar) baz (foo bar) [foo bar]',
        '1*1(foo bar) baz 1*2(foo bar)',
    ],
    [
        '"fo" 1*1"o" %x62.61 1*1"r"',
        '"foobar"',
    ],
];

for (const [source, expected] of tests) {
    test(`${source} → ${expected}`, (t) => {
        const concatenation = parseConcatenation(fromString(source), 0, () => {});
        const normalizedConcatenation = normalizeConcatenation(concatenation, {});
        const expectedConcatenation = normalizeConcatenation(parseConcatenation(fromString(expected), 0, () => {}), {});
        t.deepEqual(normalizedConcatenation, expectedConcatenation);
    });
}

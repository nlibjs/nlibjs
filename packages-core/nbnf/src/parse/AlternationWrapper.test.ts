import test from 'ava';
import {fromString, HYPHEN_MINUS, PERCENT_SIGN} from '@nlib/infra';
import {parseAlternationWrapper} from './AlternationWrapper';
import {INBNFAlternation, NBNFElementType} from '../types/base';

test('throw by missing left end', (t) => {
    t.throws(() => parseAlternationWrapper(
        HYPHEN_MINUS,
        PERCENT_SIGN,
        fromString(' foo bar % '),
        1,
        () => {},
    ));
});

test('throw by invalid right end', (t) => {
    t.throws(() => parseAlternationWrapper(
        HYPHEN_MINUS,
        PERCENT_SIGN,
        fromString(' - foo bar 1 '),
        1,
        () => {},
    ));
});

test('throw by missing right end', (t) => {
    t.throws(() => parseAlternationWrapper(
        HYPHEN_MINUS,
        PERCENT_SIGN,
        fromString(' - foo bar '),
        1,
        () => {},
    ));
});

const tests: Array<[string, number, number, number, INBNFAlternation, number]> = [
    [
        ' - foo bar % ',
        HYPHEN_MINUS,
        PERCENT_SIGN,
        1,
        [
            [
                {repeat: [1, 1], element: {type: NBNFElementType.RuleName, data: 'foo'}},
                {repeat: [1, 1], element: {type: NBNFElementType.RuleName, data: 'bar'}},
            ],
        ],
        12,
    ],
];

for (const [input, left, right, from, expected, expectedEnd] of tests) {
    test(`${JSON.stringify(input)} → ${JSON.stringify(expected)}`, (t) => {
        let position = from;
        const result = parseAlternationWrapper(
            left,
            right,
            fromString(input),
            position,
            (end) => {
                position = end;
            },
        );
        t.deepEqual(result, expected);
        t.is(position, expectedEnd);
    });
}

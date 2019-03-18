import test from 'ava';
import {fromString} from '@nlib/infra';
import {isSameNormalizedRuleList} from './RuleList';
import {parseRuleList} from '../parse';
import {normalizeRuleList} from '../normalize';

const tests: Array<[Array<string>, Array<string>, boolean]> = [
    [
        [
            'foo = bar bar',
            'bar = "baz"',
        ],
        [
            'foo = bar bar',
            'bar = "baz"',
        ],
        true,
    ],
    [
        [
            'foo = bar bar',
            'bar = "baz"',
        ],
        [
            'foo = bar bar',
            'bar = "bazo"',
        ],
        false,
    ],
];

for (const [lines1, lines2, expected] of tests) {
    test(`isSameNormalizedRuleList(${lines1}, ${lines2}) → ${expected}`, (t) => {
        t.is(
            isSameNormalizedRuleList(
                normalizeRuleList(parseRuleList(fromString(lines1.join('\n')), 0, () => {})),
                normalizeRuleList(parseRuleList(fromString(lines2.join('\n')), 0, () => {})),
            ),
            expected,
        );
    });
}

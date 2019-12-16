import test from 'ava';
import {normalizeRuleList} from './RuleList';
import {parseRuleList} from '../parse/RuleList';

const tests = [
    [
        [
            'foo  = (((("foo"))))',
            'foo  =/ ["foo"]',
            'bar  = 2*3([foo])',
            ' foo [foo / [foo]]',
            'baz  = (foo bar) (foo bar) [foo bar] (foo bar) [foo bar]',
        ],
        [
            'foo = 0*1"foo"',
            'bar = 1*5foo',
            'baz = 3*5(foo bar)',
        ],
    ],
];

for (const [sourceLines, expectedLines] of tests) {
    test(`${sourceLines.join('\\n')}→${expectedLines.join('\\n')}`, (t) => {
        const alternation = parseRuleList(sourceLines.join('\n'), 0, () => {});
        const normalizedAlternation = normalizeRuleList(alternation);
        const expectedAlternation = normalizeRuleList(parseRuleList(expectedLines.join('\n'), 0, () => {}));
        t.deepEqual(normalizedAlternation, expectedAlternation);
    });
}

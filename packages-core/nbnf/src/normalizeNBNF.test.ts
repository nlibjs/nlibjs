import test from 'ava';
import {INBNFCompilerOptions} from './types';
import {normalizeNBNF} from './normalizeNBNF';
import {parseRuleList} from './parse';
import {normalizeRuleList} from './normalize/RuleList';
import {RFC2234Rules} from './knownRules';

const tests: Array<[Array<string>, INBNFCompilerOptions, Array<string>]> = [
    [
        [
            'foo = bar bar (bar) [bar]',
            'bar = DIGIT DIGIT',
        ],
        {
            expands: RFC2234Rules,
        },
        [
            'foo = 3*4bar',
            'bar = 2%x30-39',
        ],
    ],
];

for (const [sourceLines, options, expectedLines] of tests) {
    test(`${sourceLines.join('\n')} → ${expectedLines.join('\n')}`, (t) => {
        t.deepEqual(
            normalizeNBNF(sourceLines.join('\n'), options),
            normalizeRuleList(parseRuleList(expectedLines.join('\n'), 0, () => {})),
        );
    });
}

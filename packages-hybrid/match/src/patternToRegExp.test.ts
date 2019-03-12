import test from 'ava';
import {patternToRegExp} from './patternToRegExp';
import * as index from './index';

test('index.patternToRegExp', (t) => {
    t.is(index.patternToRegExp, patternToRegExp);
});

type TestCase = [string | RegExp, RegExp];

const tests: Array<TestCase> = [
    [/foo/, /foo/],
    ['foo', /foo/],
    ['foo*', /foo[^/]*/],
    ['foo/**/*.ts', /foo\/(?:.*\/)?[^/]*\.ts/],
];

for (const [pattern, expected] of tests) {
    test(`${pattern} → ${expected}`, (t) => {
        t.is(`${patternToRegExp(pattern)}`, `${expected}`);
    });
}

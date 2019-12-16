import test from 'ava';
import {patternToRegExp} from './patternToRegExp';

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

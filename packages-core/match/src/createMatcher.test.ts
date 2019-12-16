import test from 'ava';
import {createMatcher} from './createMatcher';

type TestCase = [string | RegExp, string, boolean?];

const tests: Array<TestCase> = [
    [/foo/, 'foo'],
    ['foo', 'foo'],
    ['foo*', 'foo'],
    ['foo*', 'foobar'],
    ['foo*', 'bar', false],
    ['foo/**/*.ts', 'foo/aaa.ts', true],
    ['foo/**/*.ts', 'foo/bar/baz/aaa.ts', true],
    ['foo/**/*.ts', 'foo/bar/baz/aaa', false],
];

for (const [pattern, testee, expected = true] of tests) {
    test(`${pattern}: ${testee} → ${expected}`, (t) => {
        t.is(createMatcher(pattern)(testee), expected);
    });
}

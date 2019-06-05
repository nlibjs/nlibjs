import test from 'ava';
import {replacementFunction} from './replacementFunction';

interface ITest {
    input: Parameters<typeof replacementFunction>[0],
    tests: Array<{
        regexp: RegExp,
        source: string,
        expected: string,
    }>,
}

([
    {
        input: 'Foo$1',
        tests: [
            {
                regexp: /([XY])/g,
                source: 'Hello X and Y',
                expected: 'Hello FooX and FooY',
            },
        ],
    },
    {
        input: '{$\'}{$&}{$`}',
        tests: [
            {
                regexp: /([XY])/g,
                source: 'abXcdYef',
                expected: 'ab{cdYef}{X}{ab}cd{ef}{Y}{abXcd}ef',
            },
        ],
    },
    {
        input: (match, letter) => `${match}-${letter}`,
        tests: [
            {
                regexp: /([XY])/g,
                source: 'abXcdYef',
                expected: 'abX-XcdY-Yef',
            },
        ],
    },
] as Array<ITest>).forEach(({input, tests}) => {
    const fn = replacementFunction(input);
    tests.forEach(({regexp, source, expected}) => {
        test(`${JSON.stringify(source)} ${regexp} → ${input} → ${expected}`, (t) => {
            const actual = source.replace(regexp, fn);
            t.is(actual, expected);
            if (typeof input === 'string') {
                t.is(expected, source.replace(regexp, input));
            } else {
                t.is(expected, source.replace(regexp, input));
            }
        });
    });
});

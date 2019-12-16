import test from 'ava';
import {JSON} from '@nlib/global';
import {fromString} from '@nlib/infra';
import {skipCWSP} from './CWSP';

interface ITest {
    input: string,
    from: number,
    expected: number,
}

([
    {
        input: 'a;a\na',
        from: 1,
        expected: 1,
    },
    {
        input: 'a;a\n  a',
        from: 1,
        expected: 6,
    },
    {
        input: 'a\n  a',
        from: 1,
        expected: 4,
    },
    {
        input: 'a\r\n  a',
        from: 1,
        expected: 5,
    },
    {
        input: 'a\n\r\n  a',
        from: 1,
        expected: 6,
    },
    {
        input: 'a\n \r \n  a',
        from: 1,
        expected: 8,
    },
    {
        input: 'a\n;a\r \n  a',
        from: 1,
        expected: 9,
    },
    {
        input: 'a\n;a\r;a\n  a',
        from: 1,
        expected: 10,
    },
    {
        input: 'a\n\t\t;a\r\t\t;a\n  a',
        from: 1,
        expected: 14,
    },
] as Array<ITest>).forEach(({input, from, expected}) => {
    test(`skipCWSP(${JSON.stringify(input).replace(/\t/g, '\\t')}, ${from}) → ${expected}`, (t) => {
        t.is(skipCWSP(fromString(input), from), expected);
    });
});

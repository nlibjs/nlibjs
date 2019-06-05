import test from 'ava';
import {tokenizeReplacementString} from './tokenizeReplacementString';
import {ReplacementType} from './types';

interface ITest {
    input: string,
    expected: Array<string | ReplacementType | number>,
}

([
    {input: 'foo', expected: ['foo']},
    {input: 'foo$1', expected: [
        'foo',
        1,
    ]},
    {input: 'foo$1$$$&', expected: [
        'foo',
        1,
        '$',
        ReplacementType.Matched,
    ]},
    {input: 'foo$1$$$&$`', expected: [
        'foo',
        1,
        '$',
        ReplacementType.Matched,
        ReplacementType.Preceding,
    ]},
    {input: 'foo$1$$$&$`$\'', expected: [
        'foo',
        1,
        '$',
        ReplacementType.Matched,
        ReplacementType.Preceding,
        ReplacementType.Following,
    ]},
] as Array<ITest>).forEach(({input, expected}) => {
    test(`${input} → ${JSON.stringify(expected)}`, (t) => {
        const actual = [...tokenizeReplacementString(input)];
        t.deepEqual(actual, expected);
    });
});

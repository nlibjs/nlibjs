import test from 'ava';
import {JSON} from '@nlib/global';
import {humanReadable} from './humanReadable';

interface ITest {
    input: Parameters<typeof humanReadable>,
    expected: ReturnType<typeof humanReadable>,
}

([
    {input: [10 ** -11], expected: '10p'},
    {input: [10 ** -8], expected: '10n'},
    {input: [0.00001], expected: '10μ'},
    {input: [0.1], expected: '100m'},
    {input: [0], expected: '0'},
    {input: [1], expected: '1'},
    {input: [2], expected: '2'},
    {input: [999], expected: '999'},
    {input: [1000], expected: '1.0K'},
    {input: [999940], expected: '999.9K'},
    {input: [999950], expected: '1.0M'},
    {input: [1040000], expected: '1.0M'},
    {input: [1050000], expected: '1.1M'},
    {input: [999940000], expected: '999.9M'},
    {input: [999951000], expected: '1.0G'},
    {input: [2048, {base: 1000, digits: 2, delimiter: ' '}], expected: '2.05 K'},
    {input: [2048, {base: 2 ** 10, digits: 2, delimiter: ' '}], expected: '2.00 K'},
] as Array<ITest>).forEach(({input, expected}, index) => {
    test(`#${index} humanReadable(${JSON.stringify(input).slice(1, -1)}) → ${expected}`, (t) => {
        t.is(humanReadable(...input), expected);
    });
});

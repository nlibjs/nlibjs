import test from 'ava';
import {JSON, Uint32Array} from '@nlib/global';
import {isNonEmptyString} from './isNonEmptyString';
import * as index from './index';

interface ITest {
    input: Parameters<typeof isNonEmptyString>,
    expected: ReturnType<typeof isNonEmptyString>,
}

test('index.isNonEmptyString', (t) => {
    t.is(index.isNonEmptyString, isNonEmptyString);
});

([
    {input: [null], expected: false},
    {input: [undefined], expected: false},
    {input: [true], expected: false},
    {input: [false], expected: false},
    {input: [0], expected: false},
    {input: [NaN], expected: false},
    {input: [Infinity], expected: false},
    {input: [''], expected: false},
    {input: ['0'], expected: true},
    {input: [{}], expected: false},
    {input: [[]], expected: false},
    {input: [new Uint32Array(1)], expected: false},
] as Array<ITest>).forEach(({input, expected}, index) => {
    test(`#${index} isNonEmptyString(${JSON.stringify(input).slice(1, -1)}) → ${expected}`, (t) => {
        t.is(isNonEmptyString(...input), expected);
    });
});

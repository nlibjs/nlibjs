import test from 'ava';
import {JSON, Uint32Array} from '@nlib/global';
import {isString} from './isString';
import * as index from './index';

interface ITest {
    input: Parameters<typeof isString>,
    expected: ReturnType<typeof isString>,
}

test('index.isString', (t) => {
    t.is(index.isString, isString);
});

([
    {input: [null], expected: false},
    {input: [undefined], expected: false},
    {input: [true], expected: false},
    {input: [false], expected: false},
    {input: [0], expected: false},
    {input: [NaN], expected: false},
    {input: [Infinity], expected: false},
    {input: [''], expected: true},
    {input: ['0'], expected: true},
    {input: [{}], expected: false},
    {input: [[]], expected: false},
    {input: [new Uint32Array(1)], expected: false},
] as Array<ITest>).forEach(({input, expected}, index) => {
    test(`#${index} isString(${JSON.stringify(input).slice(1, -1)}) → ${expected}`, (t) => {
        t.is(isString(...input), expected);
    });
});

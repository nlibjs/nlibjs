import test from 'ava';
import {JSON, Uint32Array} from '@nlib/global';
import {isNumber} from './isNumber';
import * as index from './index';

interface ITest {
    input: Parameters<typeof isNumber>,
    expected: ReturnType<typeof isNumber>,
}

test('index.isNumber', (t) => {
    t.is(index.isNumber, isNumber);
});

([
    {input: [null], expected: false},
    {input: [undefined], expected: false},
    {input: [true], expected: false},
    {input: [false], expected: false},
    {input: [0], expected: true},
    {input: [NaN], expected: true},
    {input: [Infinity], expected: true},
    {input: [''], expected: false},
    {input: ['0'], expected: false},
    {input: [{}], expected: false},
    {input: [[]], expected: false},
    {input: [new Uint32Array(1)], expected: false},
] as Array<ITest>).forEach(({input, expected}, index) => {
    test(`#${index} isNumber(${JSON.stringify(input).slice(1, -1)}) → ${expected}`, (t) => {
        t.is(isNumber(...input), expected);
    });
});

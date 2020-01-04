import test from 'ava';
import {JSON, Uint32Array} from '@nlib/global';
import {isNull} from './isNull';
import * as index from './index';

interface ITest {
    input: Parameters<typeof isNull>,
    expected: ReturnType<typeof isNull>,
}

test('index.isNull', (t) => {
    t.is(index.isNull, isNull);
});

([
    {input: [null], expected: true},
    {input: [undefined], expected: false},
    {input: [true], expected: false},
    {input: [false], expected: false},
    {input: [0], expected: false},
    {input: [NaN], expected: false},
    {input: [Infinity], expected: false},
    {input: [''], expected: false},
    {input: ['0'], expected: false},
    {input: [{}], expected: false},
    {input: [[]], expected: false},
    {input: [new Uint32Array(1)], expected: false},
] as Array<ITest>).forEach(({input, expected}, index) => {
    test(`#${index} isNull(${JSON.stringify(input).slice(1, -1)}) → ${expected}`, (t) => {
        t.is(isNull(...input), expected);
    });
});

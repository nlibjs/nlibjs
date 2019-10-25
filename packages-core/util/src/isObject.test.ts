import test from 'ava';
import {JSON, Uint32Array} from '@nlib/global';
import {isObject} from './isObject';
import * as index from './index';

interface ITest {
    input: Parameters<typeof isObject>,
    expected: ReturnType<typeof isObject>,
}

test('index.isObject', (t) => {
    t.is(index.isObject, isObject);
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
    {input: ['0'], expected: false},
    {input: [{}], expected: true},
    {input: [[]], expected: true},
    {input: [new Uint32Array(1)], expected: true},
] as Array<ITest>).forEach(({input, expected}, index) => {
    test(`#${index} isObject(${JSON.stringify(input).slice(1, -1)}) → ${expected}`, (t) => {
        t.is(isObject(...input), expected);
    });
});

import test from 'ava';
import {JSON, Uint32Array} from '@nlib/global';
import {getType} from './getType';

interface ITest {
    input: Parameters<typeof getType>,
    expected: ReturnType<typeof getType>,
}

([
    {input: [null], expected: 'Null'},
    {input: [undefined], expected: 'Undefined'},
    {input: [true], expected: 'Boolean'},
    {input: [false], expected: 'Boolean'},
    {input: [0], expected: 'Number'},
    {input: [NaN], expected: 'Number'},
    {input: [Infinity], expected: 'Number'},
    {input: ['0'], expected: 'String'},
    {input: [{}], expected: 'Object'},
    {input: [[]], expected: 'Array'},
    {input: [new Uint32Array(1)], expected: 'Uint32Array'},
] as Array<ITest>).forEach(({input, expected}, index) => {
    test(`#${index} getType(${JSON.stringify(input)}) → ${expected}`, (t) => {
        t.is(getType(...input), expected);
    });
});

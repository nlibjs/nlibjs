import test from 'ava';
import {JSON, Uint32Array} from '@nlib/global';
import {getType} from './getType';

interface ITest {
    value: any,
    expected: string,
}

([
    {value: null, expected: 'Null'},
    {value: undefined, expected: 'Undefined'},
    {value: 0, expected: 'Number'},
    {value: '0', expected: 'String'},
    {value: {}, expected: 'Object'},
    {value: [], expected: 'Array'},
    {value: new Uint32Array(1), expected: 'Uint32Array'},
] as Array<ITest>).forEach(({value, expected}) => {
    test(`getType(${JSON.stringify(value)}) → ${expected}`, (t) => {
        t.is(getType(value), expected);
    });
});

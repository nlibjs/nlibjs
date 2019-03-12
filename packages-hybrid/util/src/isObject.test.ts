import test from 'ava';
import {JSON, Uint32Array} from '@nlib/global';
import {isObject} from './isObject';
import * as index from './index';

test('index.isObject', (t) => {
    t.is(index.isObject, isObject);
});

interface ITest {
    value: any,
    expected: boolean,
}

([
    {value: null, expected: false},
    {value: undefined, expected: false},
    {value: 0, expected: false},
    {value: '0', expected: false},
    {value: {}, expected: true},
    {value: [], expected: false},
    {value: new Uint32Array(1), expected: false},
] as Array<ITest>).forEach(({value, expected}) => {
    test(`isObject(${JSON.stringify(value)}) → ${expected}`, (t) => {
        t.is(isObject(value), expected);
    });
});

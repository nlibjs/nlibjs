import test from 'ava';
import {JSON, Uint32Array} from '@nlib/global';
import {isString} from './isString';
import * as index from './index';

test('index.isString', (t) => {
    t.is(index.isString, isString);
});

interface ITest {
    value: any,
    expected: boolean,
}

([
    {value: null, expected: false},
    {value: undefined, expected: false},
    {value: 0, expected: false},
    {value: '0', expected: true},
    {value: {}, expected: false},
    {value: [], expected: false},
    {value: new Uint32Array(1), expected: false},
] as Array<ITest>).forEach(({value, expected}) => {
    test(`isString(${JSON.stringify(value)}) → ${expected}`, (t) => {
        t.is(isString(value), expected);
    });
});

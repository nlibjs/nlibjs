import test from 'ava';
import {JSON, Uint32Array} from '@nlib/global';
import {isNumber} from './isNumber';
import * as index from './index';

test('index.isNumber', (t) => {
    t.is(index.isNumber, isNumber);
});

interface ITest {
    value: any,
    expected: boolean,
}

([
    {value: null, expected: false},
    {value: undefined, expected: false},
    {value: 0, expected: true},
    {value: '0', expected: false},
    {value: {}, expected: false},
    {value: [], expected: false},
    {value: new Uint32Array(1), expected: false},
] as Array<ITest>).forEach(({value, expected}) => {
    test(`isNumber(${JSON.stringify(value)}) → ${expected}`, (t) => {
        t.is(isNumber(value), expected);
    });
});

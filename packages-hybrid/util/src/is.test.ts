import test from 'ava';
import {JSON, Uint32Array} from '@nlib/global';
import {
    createTypeFilter,
    isNumber,
    isObject,
    isString,
} from './is';
import * as index from './index';

interface ITest {
    value: any,
    expected: boolean,
}

test('index.isNumber', (t) => {
    t.is(index.isNumber, isNumber);
});

([
    {value: null, expected: false},
    {value: undefined, expected: false},
    {value: 0, expected: true},
    {value: '0', expected: false},
    {value: {}, expected: false},
    {value: [], expected: false},
    {value: new Uint32Array(1), expected: false},
] as Array<ITest>).forEach(({value, expected}) => {
    const localFilter = createTypeFilter<number>('Number');
    test(`isNumber(${JSON.stringify(value)}) → ${expected}`, (t) => {
        t.is(isNumber(value), expected);
        t.is(localFilter(value), expected);
    });
});

test('index.isObject', (t) => {
    t.is(index.isObject, isObject);
});

([
    {value: null, expected: false},
    {value: undefined, expected: false},
    {value: 0, expected: false},
    {value: '0', expected: false},
    {value: {}, expected: true},
    {value: [], expected: false},
    {value: new Uint32Array(1), expected: false},
] as Array<ITest>).forEach(({value, expected}) => {
    const localFilter = createTypeFilter<number>('Object');
    test(`isObject(${JSON.stringify(value)}) → ${expected}`, (t) => {
        t.is(isObject(value), expected);
        t.is(localFilter(value), expected);
    });
});

test('index.isString', (t) => {
    t.is(index.isString, isString);
});

([
    {value: null, expected: false},
    {value: undefined, expected: false},
    {value: 0, expected: false},
    {value: '0', expected: true},
    {value: {}, expected: false},
    {value: [], expected: false},
    {value: new Uint32Array(1), expected: false},
] as Array<ITest>).forEach(({value, expected}) => {
    const localFilter = createTypeFilter<number>('String');
    test(`isString(${JSON.stringify(value)}) → ${expected}`, (t) => {
        t.is(isString(value), expected);
        t.is(localFilter(value), expected);
    });
});

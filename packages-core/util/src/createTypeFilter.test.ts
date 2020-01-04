import test from 'ava';
import {JSON, Uint32Array} from '@nlib/global';
import {createTypeFilter, ITypeFilter} from './createTypeFilter';
import * as index from './index';

interface ITest {
    type: string,
    tests: Array<{
        input: Parameters<ITypeFilter<any>>,
        expected: boolean,
    }>,
}

test('index.createTypeFilter', (t) => {
    t.is(index.createTypeFilter, createTypeFilter);
});

([
    {
        type: 'Undefined',
        tests: [
            {input: [null], expected: false},
            {input: [undefined], expected: true},
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
        ],
    },
    {
        type: 'Null',
        tests: [
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
        ],
    },
    {
        type: 'Boolean',
        tests: [
            {input: [null], expected: false},
            {input: [undefined], expected: false},
            {input: [true], expected: true},
            {input: [false], expected: true},
            {input: [0], expected: false},
            {input: [NaN], expected: false},
            {input: [Infinity], expected: false},
            {input: [''], expected: false},
            {input: ['0'], expected: false},
            {input: [{}], expected: false},
            {input: [[]], expected: false},
            {input: [new Uint32Array(1)], expected: false},
        ],
    },
    {
        type: 'Number',
        tests: [
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
        ],
    },
    {
        type: 'String',
        tests: [
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
        ],
    },
    {
        type: 'Object',
        tests: [
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
            {input: [[]], expected: false},
            {input: [new Uint32Array(1)], expected: false},
        ],
    },
    {
        type: 'Array',
        tests: [
            {input: [null], expected: false},
            {input: [undefined], expected: false},
            {input: [true], expected: false},
            {input: [false], expected: false},
            {input: [0], expected: false},
            {input: [NaN], expected: false},
            {input: [Infinity], expected: false},
            {input: [''], expected: false},
            {input: ['0'], expected: false},
            {input: [{}], expected: false},
            {input: [[]], expected: true},
            {input: [new Uint32Array(1)], expected: false},
        ],
    },
    {
        type: 'Uint32Array',
        tests: [
            {input: [null], expected: false},
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
            {input: [new Uint32Array(1)], expected: true},
        ],
    },
] as Array<ITest>).forEach(({type, tests}, i) => {
    tests.forEach(({input, expected}, j) => {
        test(`#${i}.${j} createTypeFilter(${JSON.stringify(type)})(${JSON.stringify(input).slice(1, -1)}) → ${expected}`, (t) => {
            t.is(createTypeFilter(type)(...input), expected);
        });
    });
});

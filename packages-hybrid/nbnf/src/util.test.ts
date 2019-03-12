import test from 'ava';
import {
    fromString,
    toASCIILowerCaseCodePoint,
    toString,
} from '@nlib/infra';
import * as index from './index';
import {
    nodeToDebugString,
    nodeToScalarValueString,
    nodeListToDebugString,
    nodeListToScalarValueString,
    nodeListToString,
} from './util';
import {INBNFASTNodeList} from './types';

test('index.nodeToDebugString', (t) => {
    t.is(index.nodeToDebugString, nodeToDebugString);
});

test('index.nodeToScalarValueString', (t) => {
    t.is(index.nodeToScalarValueString, nodeToScalarValueString);
});

test('index.nodeListToDebugString', (t) => {
    t.is(index.nodeListToDebugString, nodeListToDebugString);
});

test('index.nodeListToScalarValueString', (t) => {
    t.is(index.nodeListToScalarValueString, nodeListToScalarValueString);
});

interface ITest {
    input: INBNFASTNodeList,
    expected: Uint32Array,
}

([
    {
        input: [0x41, 0x62, 0x43, {name: 'foo', nodes: [0x64]}],
        expected: fromString('AbCd'),
    },
] as Array<ITest>).forEach(({input, expected}) => {
    test(`nodeListToScalarValueString(${nodeListToDebugString(input)}) → ${expected}`, (t) => {
        t.deepEqual(nodeListToScalarValueString(input), expected);
    });
});

([
    {
        input: [0x41, 0x62, 0x43, {name: 'foo', nodes: [0x64]}],
        expected: fromString('abcd'),
    },
] as Array<ITest>).forEach(({input, expected}) => {
    test(`nodeListToScalarValueString(${nodeListToDebugString(input)}, toASCIILowerCaseCodePoint) → ${expected}`, (t) => {
        t.deepEqual(nodeListToScalarValueString(input, toASCIILowerCaseCodePoint), expected);
    });
});

([
    {
        input: [0x41, 0x62, 0x43, {name: 'foo', nodes: [0x64]}],
        expected: fromString('AbCd'),
    },
] as Array<ITest>).forEach(({input, expected}) => {
    test(`nodeListToString(${nodeListToDebugString(input)}) → ${expected}`, (t) => {
        t.is(nodeListToString(input), toString(expected));
    });
});

([
    {
        input: [0x41, 0x62, 0x43, {name: 'foo', nodes: [0x64]}],
        expected: fromString('abcd'),
    },
] as Array<ITest>).forEach(({input, expected}) => {
    test(`nodeListToString(${nodeListToDebugString(input)}, toASCIILowerCaseCodePoint) → ${expected}`, (t) => {
        t.is(nodeListToString(input, toASCIILowerCaseCodePoint), toString(expected));
    });
});

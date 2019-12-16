import test from 'ava';
import {
    fromString,
    toASCIILowerCaseCodePoint,
    toString,
} from '@nlib/infra';
import {
    nodeListToDebugString,
    nodeListToScalarValueString,
    nodeListToString,
} from './util';
import {INBNFASTNodeList} from './types/misc';

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

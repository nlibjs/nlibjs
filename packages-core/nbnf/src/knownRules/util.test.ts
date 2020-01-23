import test, {TestInterface} from 'ava';
import {Array, JSON} from '@nlib/global';
import {fromString, concatenate, fromCodePoint, toString} from '@nlib/infra';
import {isNumber, isString} from '@nlib/util';
import {nodeToDebugString, defaultPositionCallback} from '../util';
import {INBNFASTNode, INBNFTokenizer} from '../types/misc';

export const toNodes = (...args: Array<string | number>): Array<number> => Array.from(concatenate(...args.map((arg) => {
    if (isNumber(arg)) {
        return fromCodePoint(arg);
    } else {
        return fromString(arg);
    }
})));

export interface ITest {
    input: string | Iterable<number>,
    rule: string,
    from?: number,
    expected?: INBNFASTNode,
}

const stringify = (x: string): string => JSON.stringify(
    x.replace(/[\x00-\x1F\x7F-\xA0\xAD]/g, (c) => `%x${fromString(c)[0].toString(16).padStart(2, '0')}`),
);

export const runTests = (
    test: TestInterface,
    parser: INBNFTokenizer,
    tests: Array<ITest>,
): void => {
    for (const {input, rule, from = 0, expected} of tests) {
        const inputString = isString(input) ? fromString(input) : fromCodePoint(...input);
        test(`${stringify(toString(inputString))} ${rule} ${from} → ${expected ? stringify(nodeToDebugString(expected)) : 'throw an error'}`, (t) => {
            if (expected) {
                t.deepEqual(parser(inputString, rule, from, defaultPositionCallback), expected);
            } else {
                t.throws(() => parser(inputString, rule, from, defaultPositionCallback));
            }
        });
    }
};

test('dummy', (t) => {
    t.pass();
});

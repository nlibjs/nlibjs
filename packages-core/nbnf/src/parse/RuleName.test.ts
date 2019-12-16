import test from 'ava';
import {fromString} from '@nlib/infra';
import {parseRuleName} from './RuleName';
import {INBNFRuleNameElement, NBNFElementType} from '../types/base';

test('throw at SPACE', (t) => {
    t.throws(() => parseRuleName(fromString('  foo'), 1, () => {}));
});

test('throw at (', (t) => {
    t.throws(() => parseRuleName(fromString('  (foo)'), 2, () => {}));
});

test('throw at right end', (t) => {
    t.throws(() => parseRuleName(fromString('  '), 2, () => {}));
});

test('throw at =', (t) => {
    t.throws(() => parseRuleName(fromString('  =(foo)'), 2, () => {}));
});

test('throw at *', (t) => {
    t.throws(() => parseRuleName(fromString('  *(foo)'), 2, () => {}));
});

test('throw at %', (t) => {
    t.throws(() => parseRuleName(fromString('  %(foo)'), 2, () => {}));
});

test('throw at "', (t) => {
    t.throws(() => parseRuleName(fromString('  "(foo)'), 2, () => {}));
});

const tests: Array<[string, number, INBNFRuleNameElement, number]> = [
    [
        '  foo  ',
        2,
        {type: NBNFElementType.RuleName, data: 'foo'},
        5,
    ],
    [
        '  fo;o  ',
        2,
        {type: NBNFElementType.RuleName, data: 'fo'},
        4,
    ],
    [
        '  f""  ',
        2,
        {type: NBNFElementType.RuleName, data: 'f""'},
        5,
    ],
    [
        '  f"%=*  ',
        2,
        {type: NBNFElementType.RuleName, data: 'f"%=*'},
        7,
    ],
    [
        '  ？😇\\ \\%  ',
        2,
        {type: NBNFElementType.RuleName, data: '？😇 %'},
        8,
    ],
];

for (const [input, from, expected, expectedEnd] of tests) {
    test(`${JSON.stringify(input)} → ${JSON.stringify(expected)}`, (t) => {
        let position = from;
        const result = parseRuleName(
            fromString(input),
            position,
            (end) => {
                position = end;
            },
        );
        t.deepEqual(result, expected);
        t.is(position, expectedEnd);
    });
}

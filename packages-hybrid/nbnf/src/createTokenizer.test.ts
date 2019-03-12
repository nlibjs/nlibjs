import test from 'ava';
import {fromString} from '@nlib/infra';
import {createTokenizerFromString} from './createTokenizer';
import {
    INBNFASTNode,
    INBNFNormalizedRuleList,
} from './types';
import {nodeToDebugString} from './util';

type NBNFLines = Array<string>;
interface INBNFTest {
    input: string,
    from: number,
    expected: INBNFASTNode,
    expectedPosition: number,
    expands?: INBNFNormalizedRuleList,
}

const tests: Array<[NBNFLines, string, Array<INBNFTest>]> = [
    [
        [
            'foo = *"bar"',
        ],
        'foo',
        [
            {
                input: 'barbarbar',
                from: 0,
                expected: {
                    name: 'foo',
                    nodes: [...fromString('barbarbar')],
                },
                expectedPosition: 9,
            },
        ],
    ],
    [
        // RFC1034 label
        [
            'label = letter [[lgh-str] let-dig]',
            'lgh-str = 1*let-dig-hyp',
            'let-dig-hyp = let-dig / "-"',
            'let-dig = letter / digit',
            'letter = %x41-5A / %x61-7A',
            'digit = %x30-39',
        ],
        'label',
        [
            {
                input: 'AB',
                from: 0,
                expected: {
                    name: 'label',
                    nodes: [
                        {
                            name: 'letter',
                            nodes: [...fromString('A')],
                        },
                        {
                            name: 'let-dig',
                            nodes: [
                                {
                                    name: 'letter',
                                    nodes: [...fromString('B')],
                                },
                            ],
                        },
                    ],
                },
                expectedPosition: 2,
            },
            {
                input: 'A-BC',
                from: 0,
                expected: {
                    name: 'label',
                    nodes: [
                        {
                            name: 'letter',
                            nodes: [...fromString('A')],
                        },
                        {
                            name: 'lgh-str',
                            nodes: [
                                {
                                    name: 'let-dig-hyp',
                                    nodes: [...fromString('-')],
                                },
                                {
                                    name: 'let-dig-hyp',
                                    nodes: [
                                        {
                                            name: 'let-dig',
                                            nodes: [
                                                {
                                                    name: 'letter',
                                                    nodes: [...fromString('B')],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            name: 'let-dig',
                            nodes: [
                                {
                                    name: 'letter',
                                    nodes: [...fromString('C')],
                                },
                            ],
                        },
                    ],
                },
                expectedPosition: 4,
            },
            {
                input: 'AB-C',
                from: 0,
                expected: {
                    name: 'label',
                    nodes: [
                        {
                            name: 'letter',
                            nodes: [...fromString('A')],
                        },
                        {
                            name: 'lgh-str',
                            nodes: [
                                {
                                    name: 'let-dig-hyp',
                                    nodes: [
                                        {
                                            name: 'let-dig',
                                            nodes: [
                                                {
                                                    name: 'letter',
                                                    nodes: [...fromString('B')],
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    name: 'let-dig-hyp',
                                    nodes: [...fromString('-')],
                                },
                            ],
                        },
                        {
                            name: 'let-dig',
                            nodes: [
                                {
                                    name: 'letter',
                                    nodes: [...fromString('C')],
                                },
                            ],
                        },
                    ],
                },
                expectedPosition: 4,
            },
            {
                input: 'foo-bar-baz-abc',
                from: 0,
                expected: {
                    name: 'label',
                    nodes: [
                        {
                            name: 'letter',
                            nodes: [...fromString('f')],
                        },
                        {
                            name: 'lgh-str',
                            nodes: [
                                {
                                    name: 'let-dig-hyp',
                                    nodes: [
                                        {
                                            name: 'let-dig',
                                            nodes: [
                                                {
                                                    name: 'letter',
                                                    nodes: [...fromString('o')],
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    name: 'let-dig-hyp',
                                    nodes: [
                                        {
                                            name: 'let-dig',
                                            nodes: [
                                                {
                                                    name: 'letter',
                                                    nodes: [...fromString('o')],
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    name: 'let-dig-hyp',
                                    nodes: [...fromString('-')],
                                },
                                {
                                    name: 'let-dig-hyp',
                                    nodes: [
                                        {
                                            name: 'let-dig',
                                            nodes: [
                                                {
                                                    name: 'letter',
                                                    nodes: [...fromString('b')],
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    name: 'let-dig-hyp',
                                    nodes: [
                                        {
                                            name: 'let-dig',
                                            nodes: [
                                                {
                                                    name: 'letter',
                                                    nodes: [...fromString('a')],
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    name: 'let-dig-hyp',
                                    nodes: [
                                        {
                                            name: 'let-dig',
                                            nodes: [
                                                {
                                                    name: 'letter',
                                                    nodes: [...fromString('r')],
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    name: 'let-dig-hyp',
                                    nodes: [...fromString('-')],
                                },
                                {
                                    name: 'let-dig-hyp',
                                    nodes: [
                                        {
                                            name: 'let-dig',
                                            nodes: [
                                                {
                                                    name: 'letter',
                                                    nodes: [...fromString('b')],
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    name: 'let-dig-hyp',
                                    nodes: [
                                        {
                                            name: 'let-dig',
                                            nodes: [
                                                {
                                                    name: 'letter',
                                                    nodes: [...fromString('a')],
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    name: 'let-dig-hyp',
                                    nodes: [
                                        {
                                            name: 'let-dig',
                                            nodes: [
                                                {
                                                    name: 'letter',
                                                    nodes: [...fromString('z')],
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    name: 'let-dig-hyp',
                                    nodes: [...fromString('-')],
                                },
                                {
                                    name: 'let-dig-hyp',
                                    nodes: [
                                        {
                                            name: 'let-dig',
                                            nodes: [
                                                {
                                                    name: 'letter',
                                                    nodes: [...fromString('a')],
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    name: 'let-dig-hyp',
                                    nodes: [
                                        {
                                            name: 'let-dig',
                                            nodes: [
                                                {
                                                    name: 'letter',
                                                    nodes: [...fromString('b')],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            name: 'let-dig',
                            nodes: [
                                {
                                    name: 'letter',
                                    nodes: [...fromString('c')],
                                },
                            ],
                        },
                    ],
                },
                expectedPosition: 15,
            },
        ],
    ],
    [
        // RFC1034 label
        [
            'domain = label *("." label)',
            'label = letter [[lgh-str] let-dig]',
            'lgh-str = 1*let-dig-hyp',
            'let-dig-hyp = let-dig / "-"',
            'let-dig = letter / digit',
            'letter = %x41-5A / %x61-7A',
            'digit = %x30-39',
        ],
        'domain',
        [
            {
                input: 'AB',
                from: 0,
                expected: {
                    name: 'domain',
                    nodes: [
                        {
                            name: 'label',
                            nodes: [
                                {
                                    name: 'letter',
                                    nodes: [...fromString('A')],
                                },
                                {
                                    name: 'let-dig',
                                    nodes: [
                                        {
                                            name: 'letter',
                                            nodes: [...fromString('B')],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                expectedPosition: 2,
            },
            {
                input: 'AB.example.com',
                from: 0,
                expected: {
                    name: 'domain',
                    nodes: [
                        {
                            name: 'label',
                            nodes: [
                                {
                                    name: 'letter',
                                    nodes: [...fromString('A')],
                                },
                                {
                                    name: 'let-dig',
                                    nodes: [
                                        {
                                            name: 'letter',
                                            nodes: [...fromString('B')],
                                        },
                                    ],
                                },
                            ],
                        },
                        ...fromString('.'),
                        {
                            name: 'label',
                            nodes: [
                                {
                                    name: 'letter',
                                    nodes: [...fromString('e')],
                                },
                                {
                                    name: 'lgh-str',
                                    nodes: [
                                        {
                                            name: 'let-dig-hyp',
                                            nodes: [
                                                {
                                                    name: 'let-dig',
                                                    nodes: [
                                                        {
                                                            name: 'letter',
                                                            nodes: [...fromString('x')],
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            name: 'let-dig-hyp',
                                            nodes: [
                                                {
                                                    name: 'let-dig',
                                                    nodes: [
                                                        {
                                                            name: 'letter',
                                                            nodes: [...fromString('a')],
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            name: 'let-dig-hyp',
                                            nodes: [
                                                {
                                                    name: 'let-dig',
                                                    nodes: [
                                                        {
                                                            name: 'letter',
                                                            nodes: [...fromString('m')],
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            name: 'let-dig-hyp',
                                            nodes: [
                                                {
                                                    name: 'let-dig',
                                                    nodes: [
                                                        {
                                                            name: 'letter',
                                                            nodes: [...fromString('p')],
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            name: 'let-dig-hyp',
                                            nodes: [
                                                {
                                                    name: 'let-dig',
                                                    nodes: [
                                                        {
                                                            name: 'letter',
                                                            nodes: [...fromString('l')],
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    name: 'let-dig',
                                    nodes: [
                                        {
                                            name: 'letter',
                                            nodes: [...fromString('e')],
                                        },
                                    ],
                                },
                            ],
                        },
                        ...fromString('.'),
                        {
                            name: 'label',
                            nodes: [
                                {
                                    name: 'letter',
                                    nodes: [...fromString('c')],
                                },
                                {
                                    name: 'lgh-str',
                                    nodes: [
                                        {
                                            name: 'let-dig-hyp',
                                            nodes: [
                                                {
                                                    name: 'let-dig',
                                                    nodes: [
                                                        {
                                                            name: 'letter',
                                                            nodes: [...fromString('o')],
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    name: 'let-dig',
                                    nodes: [
                                        {
                                            name: 'letter',
                                            nodes: [...fromString('m')],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                expectedPosition: 14,
            },
        ],
    ],
];

let count = 0;
for (const [nbnf, ruleName, cases] of tests) {
    const id = ++count;
    for (const {input, from, expected, expectedPosition, expands} of cases) {
        test(`#${id} ${ruleName} ${input} → ${nodeToDebugString(expected)}`, (t) => {
            const tokenize = createTokenizerFromString(nbnf.join('\n'), {expands});
            let position = from;
            const result = tokenize(
                input,
                ruleName,
                position,
                (end) => {
                    position = end;
                },
            );
            // t.log(JSON.stringify(result, null, 2));
            t.deepEqual(result, expected);
            t.is(position, expectedPosition);
        });
    }
}

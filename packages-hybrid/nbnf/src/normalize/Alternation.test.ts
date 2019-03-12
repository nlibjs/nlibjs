import test from 'ava';
import {fromString} from '@nlib/infra';
import {normalizeAlternation} from './Alternation';
import {parseAlternation} from '../parse/Alternation';
import * as index from './index';
import {INBNFNormalizedAlternation, NBNFNormalizedElementType} from '../types';

test('index.normalizeAlternation', (t) => {
    t.is(index.normalizeAlternation, normalizeAlternation);
});

const lightTests: Array<[string, string]> = [
    ['"foo"/"foo"', '1*1"foo"'],
    ['%x41/%x41/%x41', '1*1%x41-41'],
    ['%x41-43/(%x41-43/%x41-43)', '1*1%x41-43'],
    ['%x41.62.43/(2*4%x41.62.43/%x41.62.43)', '1*1"AbC"/2*4"AbC"'],
    ['foo/(2*4foo/foo/2*4foo/[foo])', '0*1foo/2*4foo'],
    ['%x41-43 / %x43-46 / %x42-45', '1*1%x41-46'],
    ['"A" / "B" / "C" / "A" / "B" / "C"', '1*1%x41-43'],
    ['"C" / "A" / "B" / "C" / "A" / "B"', '1*1%x41-43'],
    ['"A" / "B" / "C" / "E" / "F" / "G"', '1*1%x41-43 / 1*1%x45-47'],
    ['"C" / "E" / "A" / "G" / "F" / "B"', '1*1%x41-43 / 1*1%x45-47'],
];

for (const [source, expected] of lightTests) {
    test(`${source} → ${expected}`, (t) => {
        const alternation = parseAlternation(fromString(source), 0, () => {});
        const normalizedAlternation = normalizeAlternation(alternation, {});
        const expectedAlternation = normalizeAlternation(parseAlternation(fromString(expected), 0, () => {}), {});
        t.deepEqual(normalizedAlternation, expectedAlternation);
    });
}

const tests: Array<[string, INBNFNormalizedAlternation]> = [
    [
        '"foo"/"foo"',
        [
            [{repeat: [1, 1], element: {type: NBNFNormalizedElementType.Sequence, data: fromString('foo'), caseSensitive: true}}],
        ],
    ],
    [
        '%x41-43/%x44-46/%x48-50',
        [
            [
                {
                    repeat: [1, 1],
                    element: {
                        type: NBNFNormalizedElementType.CodePoint,
                        data: [
                            [0x41, 0x46],
                            [0x48, 0x50],
                        ],
                    },
                },
            ],
        ],
    ],
    [
        '2*3%x41-43/2*3%x44-46/2*3%x48-50',
        [
            [
                {
                    repeat: [2, 3],
                    element: {
                        type: NBNFNormalizedElementType.CodePoint,
                        data: [[0x41, 0x43]],
                    },
                },
            ],
            [
                {
                    repeat: [2, 3],
                    element: {
                        type: NBNFNormalizedElementType.CodePoint,
                        data: [[0x44, 0x46]],
                    },
                },
            ],
            [
                {
                    repeat: [2, 3],
                    element: {
                        type: NBNFNormalizedElementType.CodePoint,
                        data: [[0x48, 0x50]],
                    },
                },
            ],
        ],
    ],
    [
        // RFC1034: letter = %x41-5A / %x61-7A
        '%x41-5A / %x61-7A',
        [
            [
                {
                    repeat: [1, 1],
                    element: {
                        type: NBNFNormalizedElementType.CodePoint,
                        data: [
                            [0x41, 0x5A],
                            [0x61, 0x7A],
                        ],
                    },
                },
            ],
        ],
    ],
    [
        // RFC1034: let-dig = letter / digit
        '(%x41-5A / %x61-7A) / %x30-39',
        [
            [
                {
                    repeat: [1, 1],
                    element: {
                        type: NBNFNormalizedElementType.CodePoint,
                        data: [
                            [0x30, 0x39],
                            [0x41, 0x5A],
                            [0x61, 0x7A],
                        ],
                    },
                },
            ],
        ],
    ],
    [
        // RFC1034: let-dig-hyp = let-dig / "-"
        '((%x41-5A / %x61-7A) / %x30-39) / "-"',
        [
            [
                {
                    repeat: [1, 1],
                    element: {
                        type: NBNFNormalizedElementType.CodePoint,
                        data: [
                            [0x2D, 0x2D],
                            [0x30, 0x39],
                            [0x41, 0x5A],
                            [0x61, 0x7A],
                        ],
                    },
                },
            ],
        ],
    ],
    [
        '%i"a"/"b"',
        [
            [
                {
                    repeat: [1, 1],
                    element: {
                        type: NBNFNormalizedElementType.CodePoint,
                        data: [
                            [0x41, 0x41],
                            [0x61, 0x62],
                        ],
                    },
                },
            ],
        ],
    ],
];

for (const [source, expected] of tests) {
    test(`${source} → ${JSON.stringify(expected)}`, (t) => {
        const alternation = parseAlternation(fromString(source), 0, () => {});
        const normalizedAlternation = normalizeAlternation(alternation, {});
        t.deepEqual(normalizedAlternation, expected);
    });
}
